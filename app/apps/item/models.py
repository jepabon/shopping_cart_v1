from django.db import models
from ..product.models import Product
from ..order.models import Order


class Item(models.Model):
    amount = models.IntegerField(default=0, blank=True, null=True, verbose_name="Cantidad")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, verbose_name="Pedido")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, verbose_name="Producto")
