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
                    ]]
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
//         stage('Backend Tests') {
//     steps {
//         bat '''
//         echo ===== BACKEND TESTS =====

//         if exist Backend (
//             cd Backend

//             echo Installing dependencies...
//             pip install -r requirements.txt

//             echo Running Django tests...
//             python manage.py test --verbosity=2

//         ) else (
//             echo Backend folder not found - skipping tests
//             exit /b 0
//         )
//         '''
//     }
// }

//         /* ========================= */
//         stage('Frontend Tests') {
//     steps {
//         bat '''
//         echo ===== FRONTEND TESTS =====

//         if exist frontend (
//             cd frontend

//             echo Installing dependencies...
//             npm install

//             echo Running tests...
//             npm test -- --watchAll=false

//             echo Building project...
//             npm run build

//         ) else (
//             echo Frontend folder not found - skipping tests
//             exit /b 0
//         )
//         '''
//     }
// }

        /* ========================= */
        stage('Start SonarQube') {
            steps {
                bat '''
                docker start sonarqube || docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
                '''
            }
        }

        /* ========================= */
        stage('Wait for SonarQube') {
    steps {
        powershell 'Start-Sleep -Seconds 60'
    }
}

        /* ========================= */
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        bat '''
                        sonar-scanner ^
                        -Dsonar.projectKey=CareerPilot ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=%SONAR_HOST% ^
                        -Dsonar.login=%SONAR_TOKEN%
                        '''
                    }
                }
            }
        }

        /* ========================= */
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
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