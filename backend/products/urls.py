from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, price_range,  CategoryViewSet, SizeViewSet, size_list


router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"sizes", SizeViewSet, basename="size")

urlpatterns = [
    path("price-range/", price_range, name="price-range"),
    path("catSizeRange/", size_list, name="cat-price-range"),
    path('', include(router.urls)),
]




