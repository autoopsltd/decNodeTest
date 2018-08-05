pipeline {
    agent any
    triggers {
        pollSCM('H/30 * * * *')
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    stages {
        stage('NodeJS Build') {
            agent {
                dockerfile {
                    filename 'Dockerfile'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
                sh 'npm install --save-dev jenkins-mocha nyc'
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
        stage('Mocha/Istanbul') {
            agent {
                dockerfile {
                    filename 'Dockerfile'
                    reuseNode true
                    additionalBuildArgs '--tag autoopsltd/decnodetest:testing'
                }
            }
            steps {
                sh 'npm run test_jenkins'
            }
            post {
                success {
                    echo 'Mocha testing worked!'
                    archiveArtifacts artifacts: 'app/*.js'
                    junit '**/artifacts/**/*.xml'
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'coverage', reportFiles: 'index.html', reportName: 'HTML Report', reportTitles: ''])
                }
                failure {
                  echo 'Mocha testing failed..'
                }
            }
        }
        stage('Docker Tag/Push') {
            steps {
                withDockerRegistry([ credentialsId: "dockerhub", url: "http://localhost:5000"]) {
                    sh 'docker tag autoopsltd/decnodetest:testing localhost:5000/decnodetest:latest'
                    sh 'docker push localhost:5000/decnodetest:latest'
                }
            }
        }
    }
}









