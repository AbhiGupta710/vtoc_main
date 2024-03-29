from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from .models import TryOnModel


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = "__all__"

class UserRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        
    def validate(self, data):

        username = data['username']
        email = data['email']
        
        if len(data['password']) < 8:
            raise serializers.ValidationError({"error":"Password length must be greater than 8 .."})
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"error":"Username already exists.."})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"error":"Email already exists.."})
        
        return data
    
class TryOnModelSerializer(serializers.ModelSerializer):
    tryon_image = serializers.CharField(required=False)
    class Meta:
        model = TryOnModel
        fields = "__all__"
