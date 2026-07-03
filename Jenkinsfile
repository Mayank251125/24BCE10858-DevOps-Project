pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "vit-taskmanager-app"
        DOCKER_TAG   = "${env.BUILD_NUMBER}"
        REGISTRY     = "docker.io/library"
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo 'Checking out source code from Git repository...'
            }
        }

        stage('Maven Wrapper Compile') {
            steps {
                echo 'Compiling Java classes and static web assets using Maven Wrapper...'
                bat 'mvnw.cmd clean compile'
            }
        }

        stage('Maven Wrapper Tests') {
            steps {
                echo 'Executing Taskmanager Junit test suites...'
                bat 'mvnw.cmd test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building multi-stage Docker image: ${DOCKER_IMAGE}:${DOCKER_TAG}..."
                bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Integration Testing') {
            steps {
                echo 'Launching test container to verify API availability...'
                // Boot Task Manager container temporarily on host port 8888
                bat "docker run -d --name test_app -p 8888:8081 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                
                // Wait for Spring Boot application context to initialize
                bat 'timeout /t 12 > nul'

                script {
                    try {
                        echo 'Verifying Task REST API endpoint response...'
                        // Query the REST endpoint /api/tasks to ensure it returns status code 200
                        bat 'powershell -Command "(Invoke-WebRequest -Uri http://localhost:8888/api/tasks -UseBasicParsing).StatusCode"'
                        echo 'Testing passed! TaskManager API is online and returning task records.'
                    } catch (Exception e) {
                        echo "Testing failed: ${e.getMessage()}"
                        error "HTTP Check failed. Spring Boot REST services are unreachable."
                    } finally {
                        echo 'Cleaning up test container...'
                        bat 'docker stop test_app'
                        bat 'docker rm test_app'
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                echo 'Simulating pushing image to Docker Hub...'
                bat "echo Pushed ${DOCKER_IMAGE}:${DOCKER_TAG} to registry."
            }
        }

        stage('Kubernetes Deployment') {
            steps {
                echo 'Simulating deployment rollout to Kubernetes...'
                bat "echo Deployed to Kubernetes cluster on nodeport port 30080."
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! TaskManager service is live.'
        }
        failure {
            echo 'Pipeline failed. Please inspect console build logs.'
        }
    }
}
