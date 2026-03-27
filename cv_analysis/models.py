# cv_analysis/models.py
from django.db import models
from django.contrib.auth.models import User


class CV(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cvs')
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255, blank=True, null=True)
    extracted_text = models.TextField(blank=True, null=True)
    ats_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} - {self.user.username}"


class OptimizedCV(models.Model):
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name='optimized_versions')
    generated_content = models.TextField()
    pdf_path = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Optimized CV for {self.cv.file_name}"
