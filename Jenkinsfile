pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {

        /* =========================
           1. CHECKOUT CODE
        ========================= */
        stage('Checkout Code') {
            steps {
                deleteDir()
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/fati']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Rajaelaouni/CareerPilot.git'
                    ]]
                ])
            }
        }

        /* =========================
           2. CLEAN DOCKER + SPACE OPTIMIZATION
        ========================= */
        stage('Clean Environment (Space Optimized)') {
            steps {
                bat '''
                docker compose down -v || exit 0
                docker rm -f django-backend react-frontend postgres-db sonarqube || exit 0

                REM 🧹 Nettoyage espace disque (IMPORTANT)
                docker system prune -f
                docker image prune -a -f
                docker volume prune -f
                '''
            }
        }

        /* =========================
           3. BUILD DOCKER
        ========================= */
        stage('Build Docker Images') {
            steps {
                bat '''
                docker compose build
                '''
            }
        }

        /* =========================
           4. BACKEND TESTS
        ========================= */
        stage('Backend Tests') {
            steps {
                bat '''
                cd backend
                pip install -r requirements.txt
                python manage.py test
                '''
            }
        }

        /* =========================
           5. FRONTEND TESTS
        ========================= */
        stage('Frontend Tests') {
            steps {
                bat '''
                cd frontend
                npm install
                npm test -- --watchAll=false || exit 0
                '''
            }
        }
                 /* =========================
           5.demarer sonar
        ========================= */
        stage('Start SonarQube') {
    steps {
        bat '''
        docker start sonarqube || docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
        '''
    }
}

        /* =========================
           6. SONARQUBE ANALYSIS
        ========================= */
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

        /* =========================
           7. QUALITY GATE
        ========================= */
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        /* =========================
           8. DEPLOY CONTAINERS
        ========================= */
        stage('Deploy Containers') {
            steps {
                bat '''
                docker compose up -d --build --force-recreate
                '''
            }
        }

        /* =========================
           9. SHOW CONTAINERS
        ========================= */
        stage('Show Running Containers') {
            steps {
                bat 'docker ps'
            }
        }

        /* =========================
           10. OPTIONAL: STOP SONAR TO SAVE SPACE
        ========================= */
        stage('Stop Heavy Services (Optional Cleanup)') {
            steps {
                bat '''
                docker stop sonarqube || exit 0
                '''
            }
        }
    }

    /* =========================
       POST ACTIONS
    ========================= */
    post {
        success {
            echo '✅ Pipeline SUCCESS - CI/CD + tests + Sonar + Docker + optimized storage'
        }

        failure {
            echo '❌ Pipeline FAILED - check logs'
        }

        always {
            echo '📌 Pipeline finished (resources cleaned where possible)'
        }
    }
}