from django.contrib import admin
from .models import Order, OrderItem
from django.conf import settings

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ['id', 'customer_email', 'total_amount', 'created_at']
    readonly_fields = ['total_amount', 'created_at']

    def save_formset(self, request, form, formset, change):
        # Save the OrderItems first
        instances = formset.save(commit=False)
        for obj in instances:
            obj.save()
        formset.save_m2m()

        # Then update total_amount on the parent Order
        order = form.instance
        total = sum(
            item.price_at_purchase * item.quantity
            for item in order.items.all()
            if item.price_at_purchase and item.quantity
        )
        order.total_amount = total
        order.save()

admin.site.register(Order, OrderAdmin)



# Optional: register OrderItem only in DEBUG
if settings.DEBUG:
    admin.site.register(OrderItem)
