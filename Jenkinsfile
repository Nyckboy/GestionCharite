pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                // Good practice: remove old leftover files
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                // Pulls the latest code from GitHub/GitLab
                checkout scm
            }
        }

        stage('Build & Deploy Monorepo') {
            steps {
                echo 'Building Docker Images and starting containers...'
                // This command tells Docker Compose to rebuild the images if code changed, 
                // stop the old containers, and start the new ones in the background (-d).
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }
    
    post {
        success {
            echo 'Deployment Successful! The new code is live.'
        }
        failure {
            echo 'Deployment Failed. Check the Jenkins logs.'
        }
    }
}