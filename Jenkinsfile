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
                docker rm -f django-backend react-frontend postgres-db ^
                             careerpilot-ci-backend-1 ^
                             careerpilot-ci-frontend-1 ^
                             careerpilot-ci-db-1 ^
                             backend-backend-1 || exit 0
                docker ps -q --filter "publish=8000" > tmp.txt 2>nul
                for /f "tokens=*" %%i in (tmp.txt) do docker stop %%i && docker rm %%i
                del tmp.txt 2>nul
                docker volume prune -f
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Django Tests') {
            steps {
                bat 'docker compose run --rm backend python manage.py test'
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
                powershell '''
                    $maxAttempts = 30
                    $attempt = 0
                    $ready = $false

                    Write-Host "Waiting for SonarQube to be ready..."

                    while ($attempt -lt $maxAttempts -and -not $ready) {
                        try {
                            $response = Invoke-WebRequest -Uri "http://localhost:9000/api/server/version" `
                                                          -UseBasicParsing `
                                                          -TimeoutSec 5 `
                                                          -ErrorAction Stop
                            if ($response.StatusCode -eq 200) {
                                Write-Host "✅ SonarQube is ready! (attempt $attempt)"
                                $ready = $true
                            }
                        } catch {
                            $attempt++
                            Write-Host "⏳ Attempt $attempt/$maxAttempts - Not ready yet, waiting 10s..."
                            Start-Sleep -Seconds 10
                        }
                    }

                    if (-not $ready) {
                        Write-Host "❌ SonarQube did not start in time"
                        exit 1
                    }
                '''
            }
        }

        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'SonarQube Scanner'
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

        stage('Run Migrations') {
            steps {
                bat '''
                timeout /t 15
                docker compose exec -T backend python manage.py migrate
                '''
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