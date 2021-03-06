pipeline {
    agent any
    triggers {
        pollSCM('H/30 * * * *')
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
    }
    environment {
        sonarScannerHome = tool name: 'sonarScanner'
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
                sh 'npm install --save-dev jenkins-mocha nyc gulp gulp-uglify'
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
        stage('Gulp Tasks') {
            agent {
                dockerfile {
                    filename 'Dockerfile'
                    reuseNode true
                }
            }
            steps {
                sh 'node_modules/.bin/gulp scripts'
            }
            post {
                success {
                    echo 'Gulp task completed!'
                }
                failure {
                    echo 'Gulp task failed..'
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
                    archiveArtifacts artifacts: 'dist/*.js'
                    junit '**/artifacts/**/*.xml'
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'coverage', reportFiles: 'index.html', reportName: 'HTML Report', reportTitles: ''])
                }
                failure {
                  echo 'Mocha testing failed..'
                }
            }
        }
        stage('Sonar Analyze/Quality Gate') {
            agent any
            steps {
                withSonarQubeEnv('sonarqube') {
                    withCredentials([string(credentialsId: 'sonar', variable: 'sonarLogin')]) {
                         sh "${sonarScannerHome}/bin/sonar-scanner -e -Dsonar.host.url=http://192.168.1.15:9001 -Dsonar.login=${sonarLogin} -Dsonar.projectName=decNodeTest -Dsonar.projectVersion=${env.BUILD_NUMBER} -Dsonar.projectKey=NA -Dsonar.sources=. -Dsonar.language=js"
                    }
                }
            }
            post {
                success {
                    echo 'Sonar Quality Gate passed!'
                }
                failure {
                  echo 'Sonar Quality Gate failed..'
                }
            }
        }
        stage('Parallel Upload Artefacts') {
            when {
                branch 'master'
            }
            parallel {
                stage('Upload to Nexus') {
                    agent {
                        dockerfile {
                            filename 'Dockerfile'
                            reuseNode true
                            additionalBuildArgs '--tag autoopsltd/decnodetest:testing'
                        }
                    }
                    steps {
                        sh 'npm --version'
                        sh './setup_nexus_repo.sh'
                        sh 'npm publish --registry http://192.168.1.15:8082/repository/npm-internal/'
                        sh 'rm -f .npmrc'
                    }
                }
                stage('Upload to Artifactory') {
                    agent {
                        dockerfile {
                            filename 'Dockerfile'
                            reuseNode true
                            additionalBuildArgs '--tag autoopsltd/decnodetest:testing'
                        }
                    }
                    steps {
                        script {
                            def server = Artifactory.server 'artifactory'
                            def uploadSpec = """{
                                "files": [
                                    {
                                        "pattern": "./dist/*.js",
                                        "target": "generic-local/decNodeTest/",
                                        "recursive": "false"
                                    }
                                ]
                            }"""
                            server.upload(uploadSpec)
                            def buildInfo1 = server.upload uploadSpec
                            server.publishBuildInfo buildInfo1
                        }
                    }
                }
            }
            post {
                success {
                    echo 'Artefact uploading worked!'
                }
                failure {
                  echo 'Artefact uploading failed..'
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
        stage('Ansible Launch') {
            agent any
            steps {
                sh '/usr/bin/ansible-playbook -i /root/ansible/inventory ./playbook.yml'
            }
        }
    }
    post {
        always {
            echo 'Pipeline processing completed.'
        }
        success {
            echo "Pipeline job ${env.JOB_NAME} completed successfully with no errors."
            mail to: 'autoopsltd@outlook.com',
                 from: 'jenkins_admin@jenkins.com',
                 subject: "Pipeline Successful : ${env.JOB_NAME}",
                 body: "Pipeline job ${env.JOB_NAME} from branch ${env.BRANCH_NAME} completed successfully.  For further details visit ${env.BUILD_URL}."
        }
        failure {
            echo "Pipeline job ${env.JOB_NAME} failed."
            mail to: 'autoopsltd@outlook.com',
                 from: 'jenkins_admin@jenkins.com',
                 subject: "Pipeline Failure : ${env.JOB_NAME}",
                 body: "Pipeline job ${env.JOB_NAME} from branch ${env.BRANCH_NAME} failed.  For further details visit ${env.BUILD_URL}."
        }
        unstable {
            echo "Pipeline job ${env.JOB_NAME} completed but was declared unstable."
            mail to: 'autoopsltd@outlook.com',
                 from: 'jenkins_admin@jenkins.com',
                 subject: "Pipeline Unstable : ${env.JOB_NAME}",
                 body: "Pipeline job ${env.JOB_NAME} from branch ${env.BRANCH_NAME} completed but was declared unstable.  For further details visit ${env.BUILD_URL}."
        }
    }
}