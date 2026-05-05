import os
import re
import unicodedata
from collections import Counter
from pypdf import PdfReader
from docx import Document


# =========================
# EXTRACTION TEXTE
# =========================

def extract_text_from_pdf(file_path):
    text = []
    reader = PdfReader(file_path)
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)
    return "\n".join(text)


def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])


def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    return ""


# =========================
# NORMALISATION
# =========================

def strip_accents(text):
    return "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )


def normalize_text(text):
    text = text.lower()
    text = strip_accents(text)
    text = re.sub(r"[•·▪■►]", " ", text)
    text = re.sub(r"[\t\r]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def normalize_lines(text):
    lines = text.splitlines()
    clean_lines = []
    for line in lines:
        line = strip_accents(line.lower()).strip()
        line = re.sub(r"\s+", " ", line)
        if line:
            clean_lines.append(line)
    return clean_lines


# =========================
# DICTIONNAIRES BILINGUES
# =========================

SECTION_HEADERS = {
    "skills": [
        "skills", "technical skills", "core skills", "competencies",
        "competences", "competences techniques", "competences tech",
        "competences professionnelles", "competences cles",
        "competences clés", "competence", "competences linguistiques",
        "competences informatiques", "compétences", "compétences techniques",
        "compétences professionnelles", "savoir-faire", "hard skills"
    ],
    "experience": [
        "experience", "work experience", "professional experience",
        "employment history", "projects", "project experience",
        "experiences", "experience professionnelle", "experiences professionnelles",
        "parcours professionnel", "projets", "stages", "internships"
    ],
    "education": [
        "education", "academic background", "training", "qualifications",
        "formation", "formations", "formation academique", "formation académique",
        "cursus", "etudes", "études", "diplomes", "diplômes"
    ],
    "summary": [
        "summary", "profile", "professional summary", "about me",
        "profil", "profil professionnel", "a propos", "à propos", "resume"
    ],
    "contact": [
        "contact", "contacts", "coordonnees", "coordonnées", "informations personnelles"
    ]
}


TECH_SKILL_SYNONYMS = {
    "python": ["python"],
    "django": ["django"],
    "flask": ["flask"],
    "fastapi": ["fastapi", "fast api"],
    "java": ["java"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],
    "react": ["react", "react.js", "reactjs"],
    "vue": ["vue", "vue.js", "vuejs"],
    "angular": ["angular"],
    "node.js": ["node", "node.js", "nodejs"],
    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "bootstrap": ["bootstrap"],
    "tailwind": ["tailwind", "tailwindcss"],
    "sql": ["sql"],
    "mysql": ["mysql"],
    "postgresql": ["postgresql", "postgres", "postgre"],
    "mongodb": ["mongodb", "mongo"],
    "docker": ["docker"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws", "amazon web services"],
    "azure": ["azure", "microsoft azure"],
    "git": ["git"],
    "github": ["github"],
    "gitlab": ["gitlab"],
    "linux": ["linux"],
    "api": ["api", "rest api", "restful api", "web service", "webservice"],
    "rest": ["rest", "restful"],
    "oop": ["oop", "object oriented programming", "programmation orientee objet", "programmation orientée objet"],
    "machine learning": ["machine learning", "ml", "apprentissage automatique"],
    "data analysis": ["data analysis", "analyse de donnees", "analyse de données"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "scikit-learn": ["scikit-learn", "sklearn"],
}


SOFT_SKILL_SYNONYMS = {
    "communication": ["communication"],
    "leadership": ["leadership", "leadership technique"],
    "teamwork": ["teamwork", "travail en equipe", "travail en équipe", "collaboration"],
    "problem solving": ["problem solving", "resolution de problemes", "résolution de problèmes"],
    "adaptability": ["adaptability", "adaptation", "flexibility", "flexibilite", "flexibilité"],
    "time management": ["time management", "gestion du temps"],
    "public speaking": ["public speaking", "prise de parole", "presentation orale", "présentation orale"],
    "mentoring": ["mentoring", "encadrement", "coaching"],
    "autonomy": ["autonomy", "autonomie"],
    "critical thinking": ["critical thinking", "esprit critique"],
    "agile": ["agile", "scrum", "kanban"],
}


EXPERIENCE_TERMS = [
    "experience", "experiences", "work", "worked", "developer", "engineer",
    "internship", "intern", "project", "projects", "emploi", "poste",
    "developpeur", "développeur", "ingenieur", "ingénieur", "stage", "projet", "projets"
]

EDUCATION_TERMS = [
    "master", "bachelor", "licence", "license", "degree", "university",
    "school", "diploma", "formation", "ecole", "école", "universite",
    "université", "diplome", "diplôme", "ingenieur", "ingénieur"
]

TARGET_KEYWORDS = [
    "python", "django", "react", "sql", "docker",
    "aws", "kubernetes", "api", "git", "postgresql"
]


# =========================
# OUTILS DE MATCHING
# =========================

def contains_phrase(text, phrase):
    return phrase in text


def detect_section_presence(lines, candidates):
    for line in lines:
        for candidate in candidates:
            candidate_norm = strip_accents(candidate.lower())
            if candidate_norm == line or candidate_norm in line:
                return True
    return False


def find_skills(text, synonyms_map):
    found = []
    text_norm = normalize_text(text)

    for canonical, variants in synonyms_map.items():
        for variant in variants:
            variant_norm = normalize_text(variant)
            if contains_phrase(text_norm, variant_norm):
                found.append(canonical)
                break

    return sorted(list(set(found)))


def score_presence(found_count, total_count):
    if total_count == 0:
        return 0
    return round((found_count / total_count) * 100)


def extract_years_of_experience_hint(text):
    text_norm = normalize_text(text)
    patterns = [
        r"(\d+)\s*\+?\s*years",
        r"(\d+)\s*\+?\s*ans",
        r"(\d+)\s*\+?\s*year experience",
        r"(\d+)\s*\+?\s*ans d experience",
        r"(\d+)\s*\+?\s*annees d experience",
        r"(\d+)\s*\+?\s*années d expérience",
    ]
    years = []
    for pattern in patterns:
        matches = re.findall(pattern, text_norm)
        for m in matches:
            try:
                years.append(int(m))
            except ValueError:
                pass
    return max(years) if years else 0


def count_term_hits(text, terms):
    text_norm = normalize_text(text)
    count = 0
    for term in terms:
        if normalize_text(term) in text_norm:
            count += 1
    return count


def compute_structure_score(lines):
    score = 0
    matched_sections = []

    for section_name, candidates in SECTION_HEADERS.items():
        if detect_section_presence(lines, candidates):
            matched_sections.append(section_name)

    if "contact" in matched_sections:
        score += 15
    if "summary" in matched_sections:
        score += 15
    if "skills" in matched_sections:
        score += 25
    if "experience" in matched_sections:
        score += 25
    if "education" in matched_sections:
        score += 20

    return min(score, 100), matched_sections


def compute_experience_score(text):
    hits = count_term_hits(text, EXPERIENCE_TERMS)
    years = extract_years_of_experience_hint(text)

    base_score = min(70, hits * 10)
    bonus = min(30, years * 5)

    return min(100, base_score + bonus)


def compute_education_score(text):
    hits = count_term_hits(text, EDUCATION_TERMS)
    return min(100, max(30, hits * 12))


def compute_keyword_match(text, target_keywords):
    found = []
    text_norm = normalize_text(text)

    for keyword in target_keywords:
        if normalize_text(keyword) in text_norm:
            found.append(keyword)

    missing = [kw for kw in target_keywords if kw not in found]
    score = score_presence(len(found), len(target_keywords))
    return score, found, missing


def build_tips(found_sections, missing_keywords, structure_score, tech_skills, soft_skills):
    tips = []

    if "skills" not in found_sections:
        tips.append({
            "title": "Ajoutez une section Compétences / Skills",
            "desc": "Votre CV semble ne pas contenir de section clairement identifiée pour les compétences. Cela réduit la lisibilité ATS.",
            "priority": "haute"
        })

    if "experience" not in found_sections:
        tips.append({
            "title": "Clarifiez la section Expérience",
            "desc": "Ajoutez une section Expérience professionnelle / Work Experience bien visible.",
            "priority": "haute"
        })

    if "education" not in found_sections:
        tips.append({
            "title": "Ajoutez une section Formation / Education",
            "desc": "Une section formation claire aide le recruteur et améliore le parsing ATS.",
            "priority": "moyen"
        })

    for kw in missing_keywords[:3]:
        tips.append({
            "title": f"Ajouter le mot-clé {kw}",
            "desc": f"Le mot-clé '{kw}' semble manquer. Si vous maîtrisez cette compétence, ajoutez-la dans vos expériences ou dans la section compétences.",
            "priority": "haute" if kw in ["docker", "aws", "kubernetes", "sql"] else "moyen"
        })

    if len(tech_skills) < 4:
        tips.append({
            "title": "Renforcer les compétences techniques",
            "desc": "Votre CV contient peu de compétences techniques détectées. Ajoutez les outils, frameworks et technologies que vous maîtrisez.",
            "priority": "haute"
        })

    if len(soft_skills) < 2:
        tips.append({
            "title": "Mettre en valeur les soft skills",
            "desc": "Ajoutez des compétences transversales comme communication, travail en équipe, leadership ou autonomie.",
            "priority": "moyen"
        })

    if structure_score < 60:
        tips.append({
            "title": "Améliorer la structure globale du CV",
            "desc": "Utilisez des titres de sections explicites en français ou en anglais pour aider les ATS à mieux parser le document.",
            "priority": "haute"
        })

    if not tips:
        tips.append({
            "title": "CV globalement bien optimisé",
            "desc": "Votre CV est bien structuré et contient déjà une bonne base de compétences détectées.",
            "priority": "moyen"
        })

    return tips[:6]


# =========================
# ANALYSE ATS AVANCÉE
# =========================

def analyse_cv_text(text):
    text_norm = normalize_text(text)
    lines = normalize_lines(text)

    technical_skills = find_skills(text, TECH_SKILL_SYNONYMS)
    soft_skills = find_skills(text, SOFT_SKILL_SYNONYMS)

    technical_skill_score = score_presence(len(technical_skills), len(TECH_SKILL_SYNONYMS))
    keyword_match_score, present_keywords, missing_keywords = compute_keyword_match(text, TARGET_KEYWORDS)
    experience_score = compute_experience_score(text)
    education_score = compute_education_score(text)
    structure_score, found_sections = compute_structure_score(lines)

    ats_score = round(
        (technical_skill_score * 0.30) +
        (keyword_match_score * 0.25) +
        (experience_score * 0.20) +
        (education_score * 0.15) +
        (structure_score * 0.10)
    )

    tips = build_tips(
        found_sections=found_sections,
        missing_keywords=missing_keywords,
        structure_score=structure_score,
        tech_skills=technical_skills,
        soft_skills=soft_skills,
    )

    return {
        "ats_score": ats_score,
        "tech_relevance": technical_skill_score,
        "experience_score": experience_score,
        "education_score": education_score,
        "structure_score": structure_score,
        "technical_skills": technical_skills,
        "soft_skills": soft_skills,
        "present_keywords": present_keywords,
        "missing_keywords": missing_keywords,
        "found_sections": found_sections,
        "tips": tips,
    }