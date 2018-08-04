pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Initial NPM build') {
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
        //stage('Run Mocha Test') {
          //  steps {
            //    sh 'npm run test_jenkins'
            //}
            //post {
              //  success {
               //     echo 'Mocha testing worked!'
                 //   archiveArtifacts artifacts: '**/artifacts/**/*.xml'
                //}
                //failure {
                 //   echo 'Mocha testing failed..'
              //}
         //   }
        //}
    }
}