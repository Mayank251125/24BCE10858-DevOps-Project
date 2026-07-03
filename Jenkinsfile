pipeline {

    agent any

    environment {
        IMAGE_NAME = "vit-taskmanager-app"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                echo "Checking out source code from GitHub..."
                // Pointing to your repository and main branch
                git branch: 'main',
                    url: 'https://github.com/Mayank251125/24BCE10858-DevOps-Project.git'
            }
        }

        stage('Verify Tools') {
            steps {
                echo "Verifying Java..."
                bat 'java -version'

                echo "Verifying Maven Wrapper..."
                bat 'mvnw.cmd -version'

                echo "Verifying Docker..."
                bat 'docker --version'

                echo "Verifying Kubernetes..."
                bat 'kubectl version --client'
            }
        }

        stage('Clean Project') {
            steps {
                echo "Cleaning project..."
                bat 'mvnw.cmd clean'
            }
        }

        stage('Compile Project') {
            steps {
                echo "Compiling project..."
                bat 'mvnw.cmd compile'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo "Running unit tests..."
                bat 'mvnw.cmd test'
            }
        }

        stage('Package Application') {
            steps {
                echo "Packaging Spring Boot application..."
                bat 'mvnw.cmd package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('List Docker Images') {
            steps {
                echo "Available Docker Images"
                bat 'docker images'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying application to Kubernetes..."
                bat 'kubectl apply -f k8s/deployment.yaml'
                bat 'kubectl apply -f k8s/service.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "Checking Deployment..."
                bat 'kubectl rollout status deployment/vit-taskmanager-deployment'
                bat 'kubectl get deployments'
                bat 'kubectl get pods'
                bat 'kubectl get svc'
            }
        }

    }

    post {
        always {
            echo "Pipeline Finished."
        }
        success {
            echo "======================================="
            echo "BUILD SUCCESSFUL"
            echo "Application Deployed Successfully"
            echo "======================================="
        }
        failure {
            echo "======================================="
            echo "BUILD FAILED"
            echo "Check Jenkins Console Output"
            echo "======================================="
        }
    }
}
