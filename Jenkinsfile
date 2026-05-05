pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                deleteDir()
                git branch: 'fati', url: 'https://github.com/Rajaelaouni/CareerPilot.git'
            }
        }

        stage('Check Workspace') {
            steps {
                bat 'dir'
            }
        }

        stage('Check Python & Pip') {
            steps {
                bat 'python --version'
                bat 'pip --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'python -m pip install --upgrade pip'
                bat 'pip install -r requirements.txt'
            }
        }

        // ✅ CORRECTION ICI
        stage('Run Migrations') {
            steps {
                dir('Backend') {
                    bat 'python manage.py migrate'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('Backend') {
                    bat 'python manage.py test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat 'sonar-scanner'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t django-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                bat 'docker stop django-app || exit 0'
                bat 'docker rm django-app || exit 0'
                bat 'docker run -d -p 8000:8000 --name django-app django-app'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline exécuté avec succès!'
        }

        failure {
            echo '❌ Pipeline échoué - vérifier les logs'
        }
    }
}