pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        SONAR_HOST = "http://localhost:9000"
    }

    stages {

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

        stage('Build Docker Images') {
            steps {
                bat 'docker compose build'
            }
        }

        // ✅ FIX 1 : volumes persistants → token survit entre les builds
        stage('Start SonarQube') {
            steps {
                bat '''
                docker rm -f sonarqube || exit 0
                docker run -d --name sonarqube -p 9000:9000 ^
                  -v sonarqube_data:/opt/sonarqube/data ^
                  -v sonarqube_extensions:/opt/sonarqube/extensions ^
                  -v sonarqube_logs:/opt/sonarqube/logs ^
                  sonarqube:lts
                '''
            }
        }

        stage('Wait for SonarQube') {
            steps {
                powershell 'Start-Sleep -Seconds 120'
            }
        }

        // ✅ FIX 2 : nom du tool corrigé + sonar.token au lieu de sonar.login
        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'SonarQube Scanner'  // ← nom exact de Jenkins Tools
            }
            steps {
                bat """
                sonar-scanner ^
                -Dsonar.projectKey=careerpilot ^
                -Dsonar.sources=. ^
                -Dsonar.host.url=http://localhost:9000 ^
                -Dsonar.token=%SONAR_TOKEN%
                """
            }
        }

        // ✅ FIX 3 : Quality Gate simplifié (sans webhook)
        stage('Quality Gate') {
            steps {
                script {
                    def qgStatus = bat(
                        script: '''
                        curl -s -u %SONAR_TOKEN%: ^
                        http://localhost:9000/api/qualitygates/project_status?projectKey=careerpilot ^
                        | findstr "status"
                        ''',
                        returnStdout: true
                    ).trim()
                    echo "Quality Gate result: ${qgStatus}"
                    if (qgStatus.contains('"status":"ERROR"')) {
                        error("❌ Quality Gate FAILED")
                    }
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker compose up -d --build --force-recreate'
            }
        }

        stage('Show Running Containers') {
            steps {
                bat 'docker ps'
            }
        }

        stage('Stop SonarQube') {
            steps {
                bat 'docker stop sonarqube || exit 0'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline SUCCESS'
        }
        failure {
            echo '❌ Pipeline FAILED - check logs'
        }
        always {
            echo '📌 Pipeline finished (cleanup done)'
        }
    }
}