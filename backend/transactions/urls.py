# transactions/urls.py
from django.urls import path
from .views import profit_by_category_view

urlpatterns = [
    path("profit-by-category/", profit_by_category_view),
]