import os

DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1']

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
     'formatters': {
        'request': {
            'format':'[%(asctime)s] - %(levelname)s - %(module)s : %(message)s' , #reformat your log messages if you fancy
	    'datefmt' : '%d/%b/%Y %H:%M:%S'

        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter' : 'request',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'WARN'), #change this for more or fewer log messages
        },
    },
}

# Where to serve the static files from (ie not /readTest/static/)
STATIC_URL = '/static/'
