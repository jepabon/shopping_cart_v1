from ..models import Product
from rest_framework import serializers


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "image"]
