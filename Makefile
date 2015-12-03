.git/hooks/pre-commit:
	cp config/hooks/* .git/hooks/

git-hooks: .git/hooks/pre-commit

pre-commit: lint test-unit

setup: git-hooks
	cd api && $(MAKE) setup
	cd client && $(MAKE) setup
	cd e2e && $(MAKE) setup

lint:
	cd client && npm run lint
	cd api && npm run lint

test-unit:
	cd client && npm run test:unit
	cd api && npm run test:unit

test-integration:
	cd client && npm run test:integration
	cd api && npm run test:integration

test-e2e:
	cd client && $(MAKE) build
	cd e2e && npm test

test: test-unit test-integration test-e2e

coverage: setup
	cd api && npm run test:cov
	cd client && npm run test:cov

docker-e2e:
	cd client && $(MAKE) build
	docker-compose --project-name=app build
	docker-compose --project-name=app run e2e

docker-e2e-bust:
	cd client && $(MAKE) build
	docker-compose --project-name=app build --no-cache
	docker-compose --project-name=app run e2e

run:
	$(MAKE) -j4 start-api start-client

start-api:
	cd api && $(MAKE) run

start-client:
	cd client && $(MAKE) run

.PHONY: git-hooks setup coverage docker-e2e test test-e2e test-integration \
	test-unit lint pre-commit run start-api start-client
