pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Initial NPM build') {
            steps {
                sh 'npm install'
                sh 'npm install --save-dev jenkins-mocha expect'
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
                sh 'jenkins-mocha --cobertura test.js'
                // node_modules/jenkins-mocha/bin/jenkins.js
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