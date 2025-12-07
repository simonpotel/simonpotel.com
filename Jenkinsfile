pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'simonpotel.com'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        GIT_REPO_URL = 'https://github.com/simonpotel/simonpotel.com.git'
        GIT_CREDENTIALS_ID = 'github-pat'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        url: "${GIT_REPO_URL}",
                        credentialsId: "${GIT_CREDENTIALS_ID}"
                    ]]
                ])
            }
        }

        stage('Validate Docker Compose') {
            steps {
                echo 'Validating Docker Compose configuration...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} config --quiet'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping and removing existing containers...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down --remove-orphans || true'
            }
        }

        stage('Build and Deploy') {
            steps {
                echo 'Building and starting containers...'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Waiting for services to be healthy...'
                script {
                    sleep(time: 15, unit: 'SECONDS')
                    sh '''
                        echo "Checking container status..."
                        docker-compose -f ${DOCKER_COMPOSE_FILE} ps
                        
                        echo "Checking container logs..."
                        docker-compose -f ${DOCKER_COMPOSE_FILE} logs --tail=30
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} ps'
        }
        failure {
            echo 'Deployment failed!'
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} logs --tail=100 || true'
        }
        always {
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true)
        }
    }
}
