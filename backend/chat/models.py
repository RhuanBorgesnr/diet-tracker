from django.db import models

class Calories(models.Model):
    maintain_weight_calories = models.FloatField(blank=True, null=True)
    mild_weight_loss = models.FloatField(blank=True, null=True)
    wigth_loss = models.FloatField(blank=True, null=True)
    extreme_weight_loss = models.FloatField(blank=True, null=True)
    
    

class Question(models.Model):
    question = models.CharField(max_length=1000, blank=True, null=True)
    answer = models.TextField(blank=True, null=True)
    imc = models.FloatField(blank=True, null=True)
    tmb = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    weight = models.IntegerField(blank=True, null=True)
    weight_loss = models.IntegerField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    user = models.ForeignKey("users.User", blank=True, null=True, on_delete=models.CASCADE)
    age = models.IntegerField(blank=True, null=True)
    activity_level = models.CharField(max_length=255, blank=True, null=True)
    calorie_data = models.OneToOneField(Calories, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.question




