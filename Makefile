default: build run-service

build:
	docker-compose build

run-service:
	docker-compose run --service-ports service

run-test:
	docker-compose run --service-ports int-test