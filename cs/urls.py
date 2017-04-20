"""cs URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

import apps.utils.views
import cs.views

urlpatterns = [
    ## Project pages for Crowd sourcing ##
    url(r'^$', cs.views.index, name='index'),
    url(r'^about$', cs.views.about, name='about'),

    url('', include('django.contrib.auth.urls')),
    url(r'^register$', apps.utils.views.register, name='register'),
    url(r'^admin/', admin.site.urls),
]
