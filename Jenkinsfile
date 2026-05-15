pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Inject Secrets & Build') {
            steps {
                // 1. Add the three new Stripe credentials here
                withCredentials([
                    string(credentialsId: 'BACKEND_PROD_ENV', variable: 'BACKEND_SECRET'),
                    string(credentialsId: 'SUPABASE_URL', variable: 'URL_SECRET'),
                    string(credentialsId: 'SUPABASE_KEY', variable: 'KEY_SECRET'),
                    string(credentialsId: 'STRIPE_PUBLIC_KEY', variable: 'STRIPE_PUB'),
                    string(credentialsId: 'STRIPE_SECRET_KEY', variable: 'STRIPE_SEC'),
                    string(credentialsId: 'STRIPE_WEBHOOK_SECRET', variable: 'STRIPE_WH')
                ]) {
                    
                    writeFile file: 'backend/.env', text: env.BACKEND_SECRET
                    
                    // 2. Export ALL variables so docker-compose can see them
                    sh """
                    export VITE_SUPABASE_URL=\$URL_SECRET
                    export VITE_SUPABASE_ANON_KEY=\$KEY_SECRET
                    export VITE_STRIPE_PUBLIC_KEY=\$STRIPE_PUB
                    export STRIPE_API_KEY=\$STRIPE_SEC
                    export STRIPE_WEBHOOK_SECRET=\$STRIPE_WH
                    
                    echo 'Building Docker Images...'
                    docker-compose down
                    docker-compose build --no-cache
                    docker-compose up -d
                    """

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