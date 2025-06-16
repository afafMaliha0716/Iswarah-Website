from django_filters import rest_framework as filters
from .models import Product

class ProductFilter(filters.FilterSet):
    category = filters.CharFilter(
        field_name="category__slug",   # ← target the Category.slug field
        lookup_expr="iexact"
    )
    Price = filters.CharFilter(method="filter_price_range")

    sizes = filters.CharFilter(method="filter_by_size")
    class Meta:
        model  = Product
        fields = ["category", "Price", "sizes"]

    def filter_price_range(self, queryset, name, value):
        try:
            low, high = value.split("-")
            low, high = float(low), float(high)
        except (ValueError, TypeError):
            return queryset
        return queryset.filter(price__gte=low, price__lte=high)
    
    def filter_by_size(self, queryset, name, value): 
        if(value == "ALL"):
            return queryset.filter(sizes__isnull=False).distinct().order_by('sizes__order')
        size_list = [s.strip() for s in value.split(',')]
        return queryset.filter(sizes__slug__in=size_list).distinct()
