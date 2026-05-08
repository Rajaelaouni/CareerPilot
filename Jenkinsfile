pipeline {
    agent any

    stages {

        stage('1 - Clone GitHub') {
            steps {
                git branch: 'cesar',
                url: 'https://github.com/Rajaelaouni/CareerPilot.git'
            }
        }

        stage('2 - Check Python') {
            steps {
                bat 'python --version'
            }
        }

        stage('3 - Install Requirements') {
            steps {
                bat 'pip install -r requirements.txt'
            }
        }

        stage('4 - Django Tests') {
            steps {
                bat 'python manage.py test'
            }
        }

        stage('5 - Docker Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('6 - Docker Compose Up') {
            steps {
                bat 'docker compose up -d'
            }
        }
    }
}