pipeline {
    agent any
    stages {
        stage('Run NodeJS build') {
            agent {
                dockerfile {
                    filename 'Dockerfile'
                    reuseNode true
                }
            }
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
                }
                failure {
                  echo 'Mocha testing failed..'
                }
            }
        }
        stage('Docker Tag & Push') {
            steps {
                withDockerRegistry([ credentialsId: "dockerhub", url: ""]) {
                    sh 'docker tag autoopsltd/decnodetest:testing autoopsltd/decnodetest:latest'
                    sh 'docker push autoopsltd/decnodetest:latest'
                }
            }
        }
    }
}









