from django.db import models
from django.contrib.auth.models import User


class Order(models.Model):
    total = models.FloatField(default=0, blank=True, null=True, verbose_name="Total")
    confirmed = models.BooleanField(default=False, verbose_name="Confirmado?")
    creation_date = models.DateTimeField(auto_now_add=True, null=True, verbose_name="Fecha de Creación")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, verbose_name="Creado Por")

    def items(self, request):
        items = []
        if self.item_set.exists():
            for item in self.item_set.all():
                image_path = None
                if item.product.image:
                    image_path = '{}://{}{}'.format(request.scheme, request.META.get('HTTP_HOST'), item.product.image.url)
                items.append(
                    {
                        'price': item.product.price if item.product is not None else 0,
                        'image_path': image_path,
                        'amount': item.amount,
                        'id': item.id
                    }
                )

        return items
