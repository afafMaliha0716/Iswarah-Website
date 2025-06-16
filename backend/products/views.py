from rest_framework import viewsets, permissions   
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Min, Max
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product
from .serializers import ProductSerializer
from .filters import ProductFilter

from .models import Category
from .serializers import CategorySerializer

from .models import Size
from .serializers import SizeSerializer

print("VIEWS.PY LOADED")



class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter


@api_view(["GET"])
def price_range(request):
    qs = Product.objects.all()
    category = request.query_params.get("category")
    if category:
        qs = qs.filter(category__slug__iexact=category)


    agg = qs.aggregate(
        min_price=Min("price"),
        max_price=Max("price")
    )
    return Response(agg)

@api_view(["GET"])
def size_list(request):
    category_slug = request.query_params.get("category")
    print("Category slug received:", category_slug)

    if category_slug:
        try:
            category = Category.objects.get(slug=category_slug)
            print("Category object found:", category)
        except Category.DoesNotExist:
            print("Category not found!")
            return Response({"detail": "Category not found."}, status=404)

        products = Product.objects.filter(category=category)
        print("Total products in category:", products.count())

        products_with_size = products.filter(sizes__isnull=False)
        print("Products with size assigned:", products_with_size.count())

        size_ids = products_with_size.values_list("sizes__id", flat=True).distinct()
        print("Distinct size IDs found:", list(size_ids))

        sizes = Size.objects.filter(id__in=size_ids).order_by("order")
    else:
        sizes = Size.objects.all().order_by("order")

    serializer = SizeSerializer(sizes, many=True)
    return Response(serializer.data)




class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class SizeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Size.objects.all().order_by("order")
    serializer_class = SizeSerializer
    permission_classes = [permissions.AllowAny]