#!/usr/bin/env python3
"""
CareerPilot Interview Service - Verification Script
Checks that all components are properly installed and configured
"""

import os
import sys
import json
from pathlib import Path

class Checker:
    def __init__(self):
        self.checks = []
        self.passed = 0
        self.failed = 0
        
    def check(self, name, condition, message=""):
        status = "✅" if condition else "❌"
        result = {
            "name": name,
            "passed": condition,
            "message": message
        }
        self.checks.append(result)
        
        if condition:
            self.passed += 1
        else:
            self.failed += 1
            
        print(f"{status} {name}")
        if message and not condition:
            print(f"   {message}")
    
    def section(self, title):
        print(f"\n{'='*50}")
        print(f"  {title}")
        print(f"{'='*50}")
    
    def summary(self):
        total = self.passed + self.failed
        percentage = (self.passed / total * 100) if total > 0 else 0
        
        print(f"\n{'='*50}")
        print(f"  SUMMARY")
        print(f"{'='*50}")
        print(f"✅ Passed: {self.passed}/{total}")
        print(f"❌ Failed: {self.failed}/{total}")
        print(f"📊 Score:  {percentage:.1f}%")
        print(f"{'='*50}\n")
        
        return self.failed == 0

def main():
    checker = Checker()
    base_dir = Path(__file__).parent
    
    # ==================== Python Environment ====================
    checker.section("Python Environment")
    
    # Python version
    python_version = sys.version_info
    checker.check(
        "Python Version",
        python_version.major == 3 and python_version.minor >= 10,
        f"Current: {python_version.major}.{python_version.minor} (Required: 3.10+)"
    )
    
    # Virtual environment
    in_venv = hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )
    checker.check(
        "Virtual Environment",
        in_venv,
        "Recommended: Run inside a virtual environment"
    )
    
    # ==================== Interview Service ====================
    checker.section("Interview Service")
    
    # Check directory exists
    interview_dir = base_dir / "interview_service"
    checker.check("Interview Service Directory", interview_dir.exists())
    
    # Check required files
    files_to_check = {
        "main.py": interview_dir / "main.py",
        "config.py": interview_dir / "config.py",
        "requirements.txt": interview_dir / "requirements.txt",
        ".env.example": interview_dir / ".env.example",
        "README.md": interview_dir / "README.md",
    }
    
    for name, path in files_to_check.items():
        checker.check(f"Interview Service - {name}", path.exists())
    
    # Check .env configuration
    env_file = interview_dir / ".env"
    has_env = env_file.exists()
    checker.check("Interview Service - .env exists", has_env)
    
    if has_env:
        with open(env_file, 'r') as f:
            env_content = f.read()
            has_key = "OPENAI_API_KEY=" in env_content
            is_set = has_key and "sk-" in env_content
            checker.check(
                "Interview Service - OPENAI_API_KEY configured",
                is_set,
                "Add your OpenAI API key to .env"
            )
    
    # ==================== Frontend ====================
    checker.section("Frontend")
    
    frontend_dir = base_dir / "frontend"
    checker.check("Frontend Directory", frontend_dir.exists())
    
    # Check React component
    interview_component = frontend_dir / "src" / "pages" / "InterviewCall.jsx"
    checker.check("Frontend - InterviewCall Component", interview_component.exists())
    
    # Check CSS
    interview_css = frontend_dir / "src" / "pages" / "InterviewCall.css"
    checker.check("Frontend - InterviewCall Styles", interview_css.exists())
    
    # Check package.json
    package_json = frontend_dir / "package.json"
    checker.check("Frontend - package.json", package_json.exists())
    
    # Check node_modules (optional but good to have)
    node_modules = frontend_dir / "node_modules"
    checker.check(
        "Frontend - Dependencies installed",
        node_modules.exists(),
        "Run: cd frontend && npm install"
    )
    
    # ==================== Django ====================
    checker.section("Django Backend")
    
    # Check manage.py
    manage_py = base_dir / "manage.py"
    checker.check("Django - manage.py", manage_py.exists())
    
    # Check settings
    settings_file = base_dir / "backend_config" / "settings.py"
    checker.check("Django - settings.py", settings_file.exists())
    
    if settings_file.exists():
        with open(settings_file, 'r') as f:
            settings_content = f.read()
            has_cors = "CORS_ALLOWED_ORIGINS" in settings_content
            has_interview_port = "5174" in settings_content or "8001" in settings_content
            checker.check("Django - CORS Configured", has_cors)
            checker.check("Django - Interview Service Port", has_interview_port)
    
    # ==================== Python Dependencies ====================
    checker.section("Python Dependencies")
    
    try:
        import django
        checker.check("Django", True)
    except ImportError:
        checker.check("Django", False, "Run: pip install django")
    
    try:
        import fastapi
        checker.check("FastAPI", True)
    except ImportError:
        checker.check("FastAPI", False, "Run: cd interview_service && pip install -r requirements.txt")
    
    try:
        import openai
        checker.check("OpenAI", True)
    except ImportError:
        checker.check("OpenAI", False, "Run: cd interview_service && pip install -r requirements.txt")
    
    try:
        import websockets
        checker.check("WebSockets", True)
    except ImportError:
        checker.check("WebSockets", False, "Run: cd interview_service && pip install -r requirements.txt")
    
    try:
        import numpy
        checker.check("NumPy", True)
    except ImportError:
        checker.check("NumPy", False, "Run: cd interview_service && pip install -r requirements.txt")
    
    # ==================== Documentation ====================
    checker.section("Documentation")
    
    docs_files = {
        "README (Interview)": interview_dir / "README.md",
        "Integration Guide": base_dir / "INTERVIEW_INTEGRATION.md",
        "Quick Start": base_dir / "QUICKSTART.md",
        "Implementation": base_dir / "IMPLEMENTATION_COMPLETE.md",
        "Examples": interview_dir / "examples.py",
    }
    
    for name, path in docs_files.items():
        checker.check(f"Documentation - {name}", path.exists())
    
    # ==================== Deployment ====================
    checker.section("Deployment")
    
    docker_files = {
        "docker-compose.yml": base_dir / "docker-compose.yml",
        "Dockerfile": interview_dir / "Dockerfile",
    }
    
    for name, path in docker_files.items():
        checker.check(f"Deployment - {name}", path.exists())
    
    # ==================== Summary ====================
    all_passed = checker.summary()
    
    if all_passed:
        print("🎉 All checks passed! You're ready to go!")
        print("\n📋 Next steps:")
        print("   1. Set OPENAI_API_KEY in interview_service/.env")
        print("   2. Terminal 1: cd interview_service && python main.py")
        print("   3. Terminal 2: python manage.py runserver 8000")
        print("   4. Terminal 3: cd frontend && npm run dev")
        print("   5. Open http://localhost:5174")
        return 0
    else:
        print("⚠️  Some checks failed. Please review above and fix issues.")
        print("\n📖 See QUICKSTART.md or INTERVIEW_INTEGRATION.md for help")
        return 1

if __name__ == "__main__":
    sys.exit(main())
