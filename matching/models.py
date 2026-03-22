# matching/models.py
from django.db import models
from django.contrib.auth.models import User
from cv_analysis.models import CV


class JobOffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_offers')
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField()
    required_skills = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_title


class MatchingResult(models.Model):
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name='matching_results')
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='matching_results')
    compatibility_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    missing_skills = models.TextField(blank=True, null=True)
    recommendations = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match {self.cv.file_name} / {self.job_offer.job_title}"
