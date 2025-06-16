from rest_framework import serializers
from .models import Product, Category, Size
from django.conf import settings

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        slug_field='name'
    )
    sizes = serializers.SlugRelatedField(
        many=True,
        queryset=Size.objects.all(),
        slug_field='name'
    )

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return settings.MEDIA_URL + 'products/DefaultPic.jpg'

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'in_stock',
            'created_at',
            'image',
            # Add any other fields you need here
            'category',  # these will be at the bottom now
            'sizes'
        ]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']