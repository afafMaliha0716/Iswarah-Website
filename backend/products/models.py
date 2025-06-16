from django.db import models
from django.utils.text import slugify


class Size(models.Model):
    name  = models.CharField(max_length=100, unique=True)
    slug  = models.SlugField(max_length=100, unique=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]  # fallback to name if order ties

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    default_size= models.ManyToManyField(Size, related_name="default_for_categories", blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    


class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='products/media/', null=True, blank=True, default= 'products/media/DefaultPic.jpg')
    category = models.ForeignKey("Category", related_name="products", on_delete=models.SET_NULL, null=True,blank=True)
    sizes = models.ManyToManyField(Size, blank=True, related_name='products')  # Sizes available for this product

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            # Keep bumping “slug-1”, “slug-2” until it’s unique
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)



