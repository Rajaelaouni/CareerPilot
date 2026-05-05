pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'fati', url: 'https://github.com/Rajaelaouni/CareerPilot.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Run Migrations') {
            steps {
                sh 'python manage.py migrate'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'python manage.py test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t django-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 8000:8000 django-app'
            }
        }
    }
}