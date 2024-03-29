from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.hashers import make_password

from rest_framework.response import Response
from rest_framework.parsers import JSONParser,ParseError
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated

from . serializers import UserSerializer, UserRegisterSerializer, TryOnModelSerializer
from .models import TryOnModel
from .tryon import fit_cloth, clean_data
import base64
import os


class UserViewSet(viewsets.ModelViewSet):
    """
    UserModel View.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()


@api_view(["POST"])
def register(request):
    
    data = JSONParser().parse(request)
    user_serialize = UserRegisterSerializer(data=data)
    if user_serialize.is_valid():
        
        # data['password'] = make_password(data['password'])
        user = user_serialize.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    
    return Response(user_serialize.errors, status=status.HTTP_400_BAD_REQUEST)

       
class TryOnModelViewSet(viewsets.ModelViewSet):
    queryset = TryOnModel.objects.all()
    serializer_class = TryOnModelSerializer

    def perform_create(self, serializer):
        # data = JSONParser().parse(self.request)
        data = self.request.data

        username = data.get('username')
        person_image = data.get('person_image')
        cloth_image = data.get('cloth_image')

        save_base64_image(person_image, cloth_image, username)  # download the image at path
        tryon_image = fit_cloth(f"{username}_person.jpg", f"{username}_cloth.jpg")  # generate image
        date_time = timezone.now()
        serializer.save(username=username, person_image=person_image, cloth_image=cloth_image, tryon_image=tryon_image, date_time=date_time)
        clean_data()  # clean the images

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Response with only tryon_image
        tryon_image = serializer.data['tryon_image']
        return Response({'tryon_image': tryon_image}, status=status.HTTP_201_CREATED)
    

def save_base64_image(person, cloth, username):
    try:
        # Remove the header (e.g., 'data:image/jpeg;base64,') from the base64 data
        person_base64 = person.split(',')[1]
        cloth_base64 = cloth.split(',')[1]

        # Decode the base64 data
        person_image_data = base64.b64decode(person_base64)
        cloth_image_data = base64.b64decode(cloth_base64)
        
        # Save the image data to a file
        current_directory = os.getcwd()
        parent_directory = os.path.abspath(os.path.join(current_directory, os.pardir))
        person_save_path = parent_directory + f"\\vtoc_project\\api_app\\static\\data\\input\\image\\{username}_person.jpg"
        cloth_save_path = parent_directory + f"\\vtoc_project\\api_app\\static\\data\\input\\cloth\\{username}_cloth.jpg"
        
        with open(person_save_path, 'wb') as f:
            f.write(person_image_data)
        with open(cloth_save_path, 'wb') as f:
            f.write(cloth_image_data)

        print("Image saved successfully")
    except Exception as e:
        print(f"Failed to save image: {str(e)}")
