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

        stage('Clean Docker') {
            steps {
                bat '''
                docker compose down -v || exit 0
                docker rm -f django-backend react-frontend postgres-db || exit 0
                docker network prune -f || exit 0
                '''
            }
        }

        stage('Docker Compose Build') {
            steps {
                bat '''
                docker compose down || exit 0
                docker compose build
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        bat '''
                        sonar-scanner ^
                        -Dsonar.projectKey=CareerPilot ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.login=%SONAR_TOKEN%
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
    steps {
        timeout(time: 5, unit: 'MINUTES') {  // ← était 2, mets 5
            waitForQualityGate abortPipeline: true
        }
    }
}

        stage('Start Containers') {
            steps {
                bat 'docker compose up -d --build --force-recreate'
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