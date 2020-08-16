from django.conf.urls import url, include
from django.urls import path
from rest_framework.routers import SimpleRouter

from apps.product.api.resources import ProductViewSet
from apps.order.api.resources import OrderViewSet

router = SimpleRouter()
router.register(r'products', viewset=ProductViewSet)
router.register(r'orders', viewset=OrderViewSet)

urlpatterns = [
    url(r'', include(router.urls))
]
