from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_question_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='weight',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='weight_loss',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
