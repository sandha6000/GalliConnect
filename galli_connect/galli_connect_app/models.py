from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('PASSENGER', 'Passenger'),
        ('DRIVER', 'Driver'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.email} - {self.role}"




class DriverRoute(models.Model):
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="routes")
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    departure_time = models.CharField(max_length=50)  # or DateTimeField if needed
    cost_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    active_days = models.JSONField()  # store list like ["Monday", "Wednesday"]

    def __str__(self):
        return f"{self.driver.username}: {self.from_location} -> {self.to_location}"



