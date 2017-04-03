## PRODUCTION
try:
    from cs.settings.production import *
except ImportError:
    pass

## DEVELOPMENT
try:
    from cs.settings.development import *
except ImportError:
    pass
## LOCAL
try:
    from cs.settings.local import *
except ImportError:
    pass

