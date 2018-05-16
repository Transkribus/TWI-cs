#import os.path
from django.core.management.base import BaseCommand, CommandError
from django.http import HttpRequest
from django.conf import settings
from apps.utils import services
from cs.models import CSProject
import getpass

class Command(BaseCommand):
    args = 'collection_id'
    help = 'Set up crowd sourcing project'

    def add_arguments(self, parser):
        # Positional arguments
#        parser.add_argument('collection_id')
        # Named (optional) arguments
        parser.add_argument(
            '--collection_id',
            default=False,
            help='Provide a collection id',
        )

    def handle(self, *args, **options):
        print('Contacting Transkribus REST server  (%s)' % settings.TRP_URL)
        collection_id = options.get('collection_id')

        if(services.t_refresh()) :
            print('You are authenticated with transskribus.eu.... how did you do that?')
        else :
            print('You need to authenticate with transkribus.eu')

#            username = input('Username: ')
#            password = getpass.getpass('Password: ')
            username = 'email@example.com'
            password = '########'
            user = services.t_login(username,password)
            #print('user: %s' % user)

            request = HttpRequest()
            #Have user get the collections for which they have some level of access
            collections = services.t_collections(request)
            #if we don't already have a collection_id, get the user to choose one
            if collection_id is False :
                collection_id = self.get_collection_from_user(collections)
                
            collection = None
            for col in collections:
                if int(col.get('colId')) == int(collection_id):
                    collection = col
                    #############
                    collection['cs_flag'] = 'Y' #let's pretend
                    #############
                    break
	    
            if collection is None:
                print('Collection ID %s does not appear to be a valid collection ID' % collection_id)
                return

            print('Set up crowd sourcing project for "%s" (%s)' %  (collection.get('colName'), collection.get('colId')))

            if collection.get('role') != 'Owner' :
                print('You do not have permissiosn to crowd source this collection, your role for this collection is "%s"' % collection.get('role'))
                return

            if collection.get('cs_flag') != 'Y' :
                print("The requested collection has not be released for crowd-sourcing")
                return

            #Keep a simple record of the collection and flag for views to check, this may not be necessary or desirable longer term
            #So views may just check the flag with Transkribus
            cs = CSProject.objects.filter(collection_id=collection.get('colId')).first()
            if not cs:
                cs = CSProject(collection_id=collection.get('colId'),cs_flag=(True if collection.get('cs_flag') == "Y" else False))
                cs.save()

#            docs = services.t_documents(request,{'collId' : target_coll_id})
#            print('docs: %s' % docs)

    def get_collection_from_user(self,collections):
        print('\nPlease select a collection from the following list and enter the ID:\n')
        for col in collections:
            if(col.get('role')=='Owner') : #TODO check this criteria
                print('%s: %s (%s)' % (col.get('colId'),col.get('colName'),col.get('role')))
	    
        collection_id = input('\nEnter a collection ID: ')
        try:
            val = int(collection_id)
        except ValueError:
           print("That's not a collection ID!\n")

        return collection_id
