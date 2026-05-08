import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_ai_response(cv_text, history, user_input):
    # On récupère les réglages de ton fichier de config
    language = os.getenv("LANGUAGE", "fr")
    temp = float(os.getenv("TEMPERATURE", 0.7))
    max_t = int(os.getenv("MAX_TOKENS", 150))

    system_prompt = f"""
    Tu es un recruteur expert pour CareerPilot. Analyse ce CV : {cv_text}. 
    Mène un entretien technique en langue : {language}. 
    CONSIGNES :
    1. Pose une seule question courte à la fois.
    2. Température de réponse : {temp}.
    3. Sois direct et professionnel.
    """
    
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history[-6:])
    messages.append({"role": "user", "content": user_input})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=temp,
        max_tokens=max_t
    )
    return completion.choices[0].message.content