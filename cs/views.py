from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from django.contrib import auth
from django.contrib.auth.models import User

from cs.models import CSProject

from apps.utils.decorators import t_login_required#, t_login_required_ajax
from apps.utils.utils import t_log
from apps.utils.forms import RegisterForm
from apps.utils.services import *
from apps.navigation import navigation

import logging # only for log levels

def index(request):
#    for cs in CSProject.objects.filter(cs_flag=True).values(): #not sure when this flag would be false...
#        t_log('cs %s' % cs, logging.WARN)
#
#    cs = CSProject.objects.filter(cs_flag=True).values()

    cs = t_crowdsourcing(request)
    if isinstance(cs,HttpResponse):
        return cs

#    docStat = t_docStat(request, {'collId': collId, 'docId': docId})


    t_log('c-source %s' % cs, logging.WARN)
    if request.user.is_authenticated() : 
        collections = t_collections(request)
        if isinstance(collections,HttpResponse):
            return collections

        t_log('collections %s' % collections, logging.WARN)
        for f in cs :
            f['colStat'] =  t_collStat(request, {'collId': f.get('colId')})
            for c in collections :
                if f.get('colId') == c.get('colId'):
                    f['subscribed'] = 1

#    return render(request, 'cs_available.html', {'cs_list': cs_list} )
    return render(request, 'cs_available.html', {'cs_list': cs} )


@t_login_required
def collection(request,collId):

#    cs = CSProject.objects.filter(collection_id=collId).values()
#    t_log('cs %s' % cs, logging.WARN)

    #Avoid this sort of nonsense if possible
    collections = t_collections(request,{'end':None,'start':None})
    if isinstance(collections,HttpResponse):
        return collections

    navdata = navigation.get_nav(collections,collId,'colId','colName')
    #if we didn't have a focus before navigation call, we'll have one after
    collection = navdata.get("focus")
    pagedata = {'collection': collection}

    t_log('USER: %s' % request.user.tsdata, logging.WARN)

    documents = t_collection(request,{'collId' : collId})
    if isinstance(documents,HttpResponse):
        return documents

    t_log('DOCS:: %s' % documents, logging.WARN)

    for d in documents :
        d['docStat'] =  t_docStat(request, {'collId': collId, 'docId': d.get('docId')})

#    cs = t_crowdsourcing_unsubscribe(request,{'collId' : collId})
    #TODO  catch status code from this
    #TODO don;t call when not needed (ie logged in an user is subscribed... though calling this may be the easiest way)
    t_crowdsourcing_subscribe(request,{'collId' : collId})
   # if isinstance(cs,HttpResponse):
    #    return cs
#    t_log('c-source %s' % c_source, logging.WARN)

    #merge the dictionaries
    combidata = pagedata.copy()
    combidata.update(navdata)
    combidata['documents'] = documents

    return render(request, 'collection.html', combidata )

@t_login_required
def document(request,colId,docId):
    return render(request, 'pages/about.html')

def register(request,coll_id):
#TODO this is generic guff need to extend form for extra fields, send reg data to transkribus and authticate (which will handle the user creation)

    if request.user.is_authenticated(): #shouldn't really happen but...
#        return HttpResponseRedirect(request.build_absolute_uri('/library/'))
        return HttpResponseRedirect(request.build_absolute_uri(request.resolver_match.app_name))
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        sys.stdout.write("### IN t_register \r\n" )
        # create a form instance and populate it with data from the request:
        form = RegisterForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            sys.stdout.write("### IN form is valid \r\n" )

            # user = User.objects.create_user(form.cleaned_data['username'],password=form.cleaned_data['password'],email=form.cleaned_data['email'],first_name=form.cleaned_data['given_name'],last_name=form.cleaned_data['family_name'])
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            try:
                t_register(request)
                return HttpResponseRedirect(request.build_absolute_uri(request.resolver_match.app_name))
                #tried out modal here and it is nice (but not really for registration)
#               messages.info(request, _('Registration requested please check your email.'))
#                return HttpResponse(json.dumps({'RESET': 'true', 'MESSAGE': render_to_string('library/message_modal.html', request=request)}), content_type='text/plain')
            except ValueError as err:
                sys.stdout.write("### t_register response ERROR RAISED: %s  \r\n" % (err) )
#               return render(request, 'registration/register.html', {'register_form': form} )
                #Why the f**k won't this redirect?!? TODO fix or try another method
                return HttpResponseRedirect(request.build_absolute_uri('/library/error'))

    # if a GET (or any other method) we'll create a blank form
    else:
        form = RegisterForm()

    #Recpatch errors are not properly dislpayed by bootstrap-form... hmph
    return render(request, 'registration/register.html', {'register_form': form, 'coll_id': coll_id} )

#def login(request):
#    coll_id = None
#    if request.GET.get('next') is not None :
#        coll_id = request.GET.get('next').replace('/','')
#    return render(request, 'registration/login.html', {'coll_id': coll_id, 'form': auth.forms.AuthenticationForm} )

def about(request):
    return render(request, 'pages/about.html')

def user_guide(request):
    return render(request, 'pages/user_guide.html')

