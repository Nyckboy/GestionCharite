pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                // Remove old leftover files from previous builds
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                // Pull the latest code from your repository
                checkout scm
            }
        }

        stage('Inject Secrets & Build') {
            steps {
                // Grab BOTH secrets from Jenkins Credentials
                withCredentials([
                    string(credentialsId: 'BACKEND_PROD_ENV', variable: 'BACKEND_SECRET'),
                    string(credentialsId: 'FRONTEND_PROD_ENV', variable: 'FRONTEND_SECRET')
                ]) {
                    // 1. Write the Spring Boot secrets into the backend folder
                    sh 'echo "$BACKEND_SECRET" > backend/.env'
                    
                    // 2. Write the Supabase keys into the frontend folder
                    sh 'echo "$FRONTEND_SECRET" > frontend/.env'
                    
                    // 3. Build the images and start the containers
                    echo 'Building Docker Images and starting containers...'
                    sh 'docker-compose down'
                    sh 'docker-compose up -d --build'
                    
                    // 4. Securely delete the files so passwords aren't left behind
                    sh 'rm backend/.env'
                    sh 'rm frontend/.env'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment Successful! The new code is live.'
        }
        failure {
            echo 'Deployment Failed. Check the Jenkins console output for errors.'
        }
    }
}