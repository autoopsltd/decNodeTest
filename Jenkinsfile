pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Initial NPM build') {
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
        stage('Run Mocha Test') {
            steps {
                sh 'mocha test.js --exit'
            }
            post {
                success {
                    echo 'Mocha testing worked!'
                }
                failure {
                    echo 'Mocha testing failed..'
                }
            }
        }
    }
}