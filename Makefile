# Variables
DOCKER_COMPOSE_FILE=docker-compose.yml

# Install dependencies
install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

# Start development environment
dev:
	./scripts/dev.sh

# Build the project
build:
	docker build -t docmind-backend -f Dockerfile.backend .
	docker build -t docmind-frontend -f Dockerfile.frontend .

# Run tests
test:
	pytest backend/tests
	cd frontend && npm test

# Start Docker containers
docker-up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop Docker containers
docker-down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Clean up Docker resources
clean:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --volumes --remove-orphans
	docker system prune -f