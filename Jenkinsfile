pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                deleteDir()

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/fati']],
                    userRemoteConfigs: [[url: 'https://github.com/Rajaelaouni/CareerPilot.git']]
                ])
            }
        }

        stage('Docker Compose Build') {
            steps {
                bat 'docker compose down'
                bat 'docker compose build'
            }
        }

        stage('Start Containers') {
            steps {
                bat 'docker compose up -d'
            }
        }

        stage('Show Running Containers') {
            steps {
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline exécuté avec succès'
        }

        failure {
            echo '❌ Pipeline échoué'
        }
    }
}