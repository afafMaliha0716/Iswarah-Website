from django.contrib import admin
from django import forms

from .models import Category, Product, Size

from django.forms.widgets import CheckboxSelectMultiple

from django.urls import path
from django.http import JsonResponse
from adminsortable2.admin import SortableAdminMixin



class CatoagoryForms(forms.ModelForm):
    default_size = forms.ModelMultipleChoiceField(
        queryset=Size.objects.all(),
        widget=CheckboxSelectMultiple,
        label="Default sizes",
        help_text="Select the default sizes",
        required=False
    )

    class Meta:
        model = Category
        fields = "__all__"

class ProductAdminForm(forms.ModelForm):
    sizes = forms.ModelMultipleChoiceField(
        queryset=Size.objects.all(),
        widget=CheckboxSelectMultiple,
        label="Sizes",
        help_text="Select the sizes",
        required=False,
    )

    class Meta:
        model = Product
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Pre-populate with saved sizes on edit
        if self.instance and self.instance.pk:
            self.fields["sizes"].initial = self.instance.sizes.all()

@admin.register(Size)
class SizeAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display      = ("name", "slug", "order")

    prepopulated_fields = {"slug": ("name",)}

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display        = ("name", "slug")
    form = CatoagoryForms



@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display        = ("name", "price", "category", "in_stock")
    prepopulated_fields = {"slug": ("name",)}
    list_filter         = ("category", "in_stock")

    # AJAX endpoint to fetch default sizes for a category
    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                'default-sizes/<int:cat_id>/',
                self.admin_site.admin_view(self.default_sizes_view),
                name='product_default_sizes'
            ),
        ]
        return custom + urls

    def default_sizes_view(self, request, cat_id, *args, **kwargs):
        ids = list(
            Size.objects
                .filter(default_for_categories__pk=cat_id)
                .values_list('pk', flat=True)
        )
        return JsonResponse({'sizes': ids})

    class Media:
        js = ("admin/js/_product_default_sizes.js",)