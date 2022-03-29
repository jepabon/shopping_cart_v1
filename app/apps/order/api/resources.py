from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Order
from .serializers import OrderSerializer
from django.utils import timezone
from rest_framework.decorators import action
from ...item.models import Item
from ...product.models import Product
from django.db.models import Sum, F, FloatField


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def get_queryset(self):
        return self.request.user.order_set.all()
    
    @action(methods=['get'], detail=False, name="get_count_items_active_order")
    def get_count_items_active_order(self, request):
        active_order = self.request.user.order_set.filter(confirmed=False).first()

        if active_order is not None:
            return Response(active_order.item_set.count())
        else:
            return Response({'status': 'Order not found'})

    @action(methods=['get'], detail=False, name="get_active_order")
    def get_active_order(self, request):
        active_order = self.request.user.order_set.filter(confirmed=False).first()

        if active_order is not None:

            serializer = OrderSerializer(active_order)

            active_order_dict = {
                'order': serializer.data,
                'items': active_order.items(request),
            }

            return Response(active_order_dict)
        else:
            return Response({'status': 'Order not found'})

    @action(methods=['get'], detail=False, name="confirmed_order")
    def confirmed_order(self, request):
        order = self.request.user.order_set.filter(confirmed=False).first()

        if order is not None:
            order.confirmed = True
            order.save()

            order_dict = {
                'order': None,
                'items': [],
                'status': "Order confirmed"
            }

            return Response(order_dict)
        else:
            return Response({'status': 'Order not found'})

    @action(methods=['post'], detail=False, name="add_product")
    def add_product(self, request):
        order = self.request.user.order_set.filter(confirmed=False).first()

        if order is None:
            order = Order()
            order.creation_date = timezone.now()
            order.created_by = self.request.user
            order.save()

        data = self.request.data
        id_product = data.get('id_product')

        product = Product.objects.filter(id=id_product).first()

        if order is not None and product is not None:
            amount = data.get('amount')
            if order.item_set.filter(product=product).exists():
                item = order.item_set.filter(product=product).first()
                amount += item.amount
            else:
                item = Item()

            item.amount = amount
            item.order = order
            item.product = product
            item.save()

            order.total = order.item_set.aggregate(total=Sum(F('product__price') * F('amount'),
                                                    output_field=FloatField())).get('total', 0)
            order.save()

            return Response({'status': 'Add Item successfuly', 'error': False})
        else:
            return Response({'status': 'Error adding item', 'error': True})

    @action(methods=['post'], detail=False, name="remove_product")
    def remove_product(self, request):
        order = self.request.user.order_set.filter(confirmed=False).first()
        data = self.request.data
        item = order.item_set.filter(id=data.get('id')).first()
        if item is not None:
            item.delete()
            order.total = order.item_set.aggregate(total=Sum(F('product__price') * F('amount'),
                                                    output_field=FloatField())).get('total', 0)
            order.save()

            serializer = OrderSerializer(order)

            order_dict = {
                'order': serializer.data,
                'items': order.items(request)
            }

            return Response(order_dict)
        else:
            return Response({'status': 'Error removing item'})

    @action(methods=['get'], detail=False, name="clean_products")
    def clean_products(self, request):
        order = self.request.user.order_set.filter(confirmed=False).first()
        if order is not None:
            items = order.item_set.all()
            if items is not None:
                items.delete()
                order.total = order.item_set.aggregate(total=Sum(F('product__price') * F('amount'),
                                                        output_field=FloatField())).get('total', 0)
                order.save()

                serializer = OrderSerializer(order)

                order_dict = {
                    'order': serializer.data,
                    'items': order.items(request)
                }

                return Response(order_dict)
        else:
            return Response({'status': 'Error cleaning items'})
