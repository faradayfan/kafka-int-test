default: build run stop

build:
	docker-compose build

run:
	docker-compose up service

stop:
	docker-compose down

run-test:
	docker-compose run --service-ports int-test