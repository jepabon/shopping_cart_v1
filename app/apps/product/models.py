from django.db import models
from django.core.exceptions import ValidationError


def validate_file_extension(value):
    ext_valid = ('jpg', 'jpeg', 'png')
    str_ext_valid = ' , '.join(ext_valid)
    if not value.name.endswith(ext_valid):
        raise ValidationError(u'%(value)s: Bat extension, only %(ext_valid)s',
                                params={'value': value, 'ext_valid': str_ext_valid})


class Product(models.Model):
    name = models.CharField(max_length=50, null=True, blank=False, verbose_name="Nombre")
    price = models.FloatField(default=0, null=False, blank=False, verbose_name="Precio")
    image = models.FileField(blank=True, null=True, verbose_name="Imagen", validators=[validate_file_extension])

    def __str__(self):
        return self.name
