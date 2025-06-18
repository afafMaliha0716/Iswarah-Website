from django.db import models
from products.models import Product, Size, Category

class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    customer_email = models.EmailField(blank=True, null=True)  # optional for guests
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null= True, blank= True)
    # Add fields like payment status, etc. as needed

    def save(self, *args, **kwargs):
        if self.pk:  # only recalculate if order already saved (has items)
            self.total_amount = sum(
                item.price_at_purchase * item.quantity
                for item in self.items.all()
                if item.price_at_purchase and item.quantity
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.id} – ${self.total_amount}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot

    def get_total(self):
        return self.price_at_purchase * self.quantity

    def get_category(self):
        return self.product.category

    def __str__(self):
        return f"{self.quantity} × {self.product.name} (Size: {self.size})"
