all: run

node_modules: package.json
	npm install --quiet

setup: node_modules

build:
	npm run build

run:
	npm run start

test:
	npm test

clean:
	-rm -rf node_modules
	-rm -rf build

.PHONY: clean test run build setup
