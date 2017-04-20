from django.shortcuts import render
from django.http import HttpResponseRedirect
from cs.models import CSProject
from apps.utils.utils import t_log
import logging # only for log levels

def index(request):
    for cs in CSProject.objects.filter(cs_flag=True).values(): #not sure when this flag would be false...
        t_log('cs %s' % cs, logging.WARN)

    cs_list = CSProject.objects.filter(cs_flag=True).values()

    return render(request, 'cs_available.html', {'cs_list': cs_list} )

def about(request):
    return render(request, 'pages/about.html')

def user_guide(request):
    return render(request, 'pages/user_guide.html')

