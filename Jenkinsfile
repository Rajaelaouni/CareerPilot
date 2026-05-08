pipeline {
    agent any

    stages {
        stage('1 - Checkout GitHub') {
            steps {
                checkout scm
            }
        }

        stage('2 - Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('3 - Start Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('4 - Django Migrations') {
            steps {
                sh 'docker compose exec -T backend python manage.py migrate'
            }
        }

        stage('5 - Django Tests') {
            steps {
                sh 'docker compose exec -T backend python manage.py test'
            }
        }
    }
}