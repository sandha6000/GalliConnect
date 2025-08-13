# galli_connect_app/views.py
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'index.html') 

def homepage(request):
    return render(request, 'index.html') 