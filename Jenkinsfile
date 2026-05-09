pipeline {
    agent any

    stages {
        stage('1 - Checkout GitHub') {
            steps {
                checkout scm
            }
        }

        stage('2 - Check Tools') {
            steps {
                sh 'python3 --version'
                sh 'pip3 --version'
                sh 'node --version'
                sh 'npm --version'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('3 - Backend Dependencies') {
            steps {
                sh 'pip3 install --break-system-packages -r requirements.txt'
            }
        }

        stage('4 - Django Tests') {
            steps {
                sh 'python3 manage.py test'
            }
        }

        stage('5 - Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('6 - Docker Up') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('7 - Migrations Docker') {
            steps {
                sh 'docker compose exec -T backend python manage.py migrate'
            }
        }
    }
}