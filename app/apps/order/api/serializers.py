from ..models import Order
from rest_framework import serializers


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    creation_date = serializers.ReadOnlyField()
    created_by = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "total", "confirmed", "creation_date", "created_by"]
