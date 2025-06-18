from django.http import JsonResponse
from django.db.models import F, Sum
from transactions.models import OrderItem

def profit_by_category_view(request):
    data = (
        OrderItem.objects
        .values("product__category__name")
        .annotate(total=Sum(F("price_at_purchase") * F("quantity")))
        .order_by("-total")
    )
    return JsonResponse(list(data), safe=False)