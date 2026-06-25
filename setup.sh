#!/bin/bash
# Quick Start Script for CareerPilot Interview Service

echo "🚀 CareerPilot Interview Service - Quick Start"
echo "=" 
echo ""

# Check Python
echo "📋 Checking Python..."
python --version || { echo "Python not found!"; exit 1; }

# Check Node.js
echo "📋 Checking Node.js..."
node --version || { echo "Node.js not found!"; exit 1; }

# Interview Service Setup
echo ""
echo "📦 Setting up Interview Service..."
cd interview_service

# Create virtual environment if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || source venv\Scripts\activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please edit it with your OpenAI API key:"
    echo "   OPENAI_API_KEY=sk-your-key-here"
fi

cd ..

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

cd ..

# Django Setup (optional)
echo ""
echo "📦 Django already configured"

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the services, run in separate terminals:"
echo ""
echo "Terminal 1 - Interview Service:"
echo "  cd interview_service"
echo "  python main.py"
echo ""
echo "Terminal 2 - Django Backend:"
echo "  python manage.py runserver 8000"
echo ""
echo "Terminal 3 - React Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5174"
echo ""
