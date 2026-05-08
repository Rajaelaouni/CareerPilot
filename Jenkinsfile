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
                sh 'python3 --version'
            }
        }

        stage('3 - Install Requirements') {
            steps {
                sh 'pip3 install -r requirements.txt'
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

        stage('6 - Docker Compose Up') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }
}