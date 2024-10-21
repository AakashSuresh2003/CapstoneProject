pipeline {
    agent any
    tools {
        dockerTool 'docker'
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/AakashSuresh2003/CapstoneProject.git', branch: 'main'
            }
        }
        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }
        stage('Test Docker Connection') {
            steps {
                script {
                    sh 'docker info'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def Image = docker.build("aakashsuresh/node-app:latest")
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.image("aakashsuresh/node-app:latest").push("latest")
                    }
                }
            }
        }
        stage("Deploy") {
            steps {
                sshagent(['newpvtkey']) {
                    sh '''
                        scp -o StrictHostKeyChecking=no docker-compose.yaml ubuntu@3.110.164.38:/tmp/
                        ssh -v -o StrictHostKeyChecking=no ubuntu@3.110.164.38 '
                            sudo mv /tmp/docker-compose.yaml /home/ &&
                            sudo docker compose -f /home/docker-compose.yaml up -d
                        '
                    '''
                }
            }
        }
    }
}