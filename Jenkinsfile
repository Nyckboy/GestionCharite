pipeline {
   agent any

   stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Build Spring Boot (Backend)') {
            steps {
                dir('backend') {
                    echo 'Compiling Java and building Backend Docker Image...'
                }
            }
        }
        stage('Build React (Frontend)') {
            steps {
                dir('frontend') {
                    echo 'Compiling UI and building Frontend Docker Image...'
                }
            }
        }
        stage('Deploy to VPS') {
            steps {
                    echo 'Spinning up the new containers!'
            }
        }
   }
}