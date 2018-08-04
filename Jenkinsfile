pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Initial NPM install') {
            steps {
                sh 'npm install mocha expect'
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