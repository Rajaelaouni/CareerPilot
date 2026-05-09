pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        SONAR_HOST = "http://localhost:9000"
    }

    stages {

        /* ========================= */
stage('Checkout Code') {
    steps {
        deleteDir()
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/fati']],
            userRemoteConfigs: [[
                url: 'https://github.com/Rajaelaouni/CareerPilot.git'
            ]],
            extensions: [
                [$class: 'CloneOption',
                 shallow: true,
                 depth: 1,
                 noTags: true,
                 timeout: 30
                ]
            ]
        ])
    }
}

        /* ========================= */
        stage('Clean Environment') {
            steps {
                bat '''
                docker compose down -v || exit 0
                docker rm -f django-backend react-frontend postgres-db || exit 0

                docker system prune -f
                docker volume prune -f
                '''
            }
        }

        /* ========================= */
        stage('Build Docker Images') {
            steps {
                bat 'docker compose build'
            }
        }

         /* ========================= */
       stage('Start SonarQube') {
    steps {
        bat '''
        docker rm -f sonarqube || exit 0
        docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
        '''
    }
}

        /* ========================= */
        stage('Wait for SonarQube') {
    steps {
        powershell 'Start-Sleep -Seconds 120'
    }
}

        /* ========================= */
stage('SonarQube Analysis') {
    environment {
        scannerHome = tool 'SonarQubeScanner'
    }
    steps {
        bat """
        sonar-scanner ^
        -Dsonar.projectKey=careerpilot ^
        -Dsonar.sources=. ^
        -Dsonar.host.url=http://localhost:9000 ^
        -Dsonar.login=%SONAR_TOKEN%
        """
    }
}

        /* ========================= */
        stage('Quality Gate') {
            steps {
                timeout(time: 20, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        /* ========================= */
        stage('Deploy Containers') {
            steps {
                bat 'docker compose up -d --build --force-recreate'
            }
        }

        /* ========================= */
        stage('Show Running Containers') {
            steps {
                bat 'docker ps'
            }
        }

        /* ========================= */
        stage('Stop SonarQube') {
            steps {
                bat 'docker stop sonarqube || exit 0'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline SUCCESS (CI/CD + Docker + Sonar + Tests)'
        }

        failure {
            echo '❌ Pipeline FAILED - check logs'
        }

        always {
            echo '📌 Pipeline finished (cleanup done)'
        }
    }
}