pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version

                    echo "NPM version:"
                    npm --version

                    echo "Docker version:"
                    docker --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Application Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                    -t employee-management:${BUILD_NUMBER} .
                '''
            }
        }

    }

    post {

        success {
            echo 'CI pipeline completed successfully.'
        }

        failure {
            echo 'CI pipeline failed.'
        }

        always {
            echo "Build number: ${BUILD_NUMBER}"
        }
    }
}
