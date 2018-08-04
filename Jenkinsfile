pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('npm install') {
            steps {
                sh 'npm install'
            }
            post {
                success {
                    echo 'Npm install worked!'
                }
                failure {
                    echo 'Npm install failed..'
                }
            }
        }
    }
}