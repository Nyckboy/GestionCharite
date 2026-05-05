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
                withCredentials([
                    string(credentialsId: 'BACKEND_PROD_ENV', variable: 'BACKEND_SECRET'),
                    string(credentialsId: 'SUPABASE_URL', variable: 'URL_SECRET'),
                    string(credentialsId: 'SUPABASE_KEY', variable: 'KEY_SECRET')
                ]) {
                    // 1. Write the Spring Boot file (Backend still needs this)
                    writeFile file: 'backend/.env', text: env.BACKEND_SECRET
                    
                    // 2. Export Frontend variables straight into the terminal memory, then build!
                    sh """
                    export VITE_SUPABASE_URL=\$URL_SECRET
                    export VITE_SUPABASE_ANON_KEY=\$KEY_SECRET
                    
                    echo 'Building Docker Images...'
                    docker-compose down
                    docker-compose build --no-cache
                    docker-compose up -d
                    """
                    
                    // 3. Clean up backend file
                    sh 'rm backend/.env'
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