from django.db import models

#CSProject is the collection with collection_id a crowd sourcing project or not? (that's all we want to know)
class CSProject(models.Model):
    collection_id = models.PositiveSmallIntegerField()
    cs_flag = models.BooleanField()

    def __int__(self):
        return self.collection_id

