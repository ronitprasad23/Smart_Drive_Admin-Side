import os
from google import genai
from django.conf import settings

def generate_safety_feedback(trip_instance, alerts_queryset):
    """
    Generates AI feedback using Google Gemini API.
    """

    distance = trip_instance.distance_km

    high_severity_count = alerts_queryset.filter(severity__in=['MODERATE_RISK', 'CRITICAL_RISK']).count()
    drowsiness_count = alerts_queryset.filter(alert_type__name__icontains='Drowsiness').count()
    speeding_count = alerts_queryset.filter(alert_type__name__icontains='Speeding').count()

    prompt = f"""
    You are an AI Driving Safety Coach. Analyze this trip:
    - Distance: {distance} km
    - High Severity Alerts: {high_severity_count}
    - Drowsiness Events: {drowsiness_count}
    - Speeding Events: {speeding_count}

    Provide 2 short, helpful sentences of feedback to the driver. Focus on safety and improvement.
    """

    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        return "AI Configuration Error: GEMINI_API_KEY not found. Please add it to your environment variables."

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-1.5-flash', contents=prompt
        )
        return response.text
    except Exception as e:
        return f"AI Service Error: {str(e)}"