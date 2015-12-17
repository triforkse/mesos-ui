all: run

run:
	npm run start

node_modules: package.json
	npm install --quiet

setup: node_modules

build:
	npm run build

test:
	npm test

clean:
	rm -rf node_modules
	rm -rf build

.PHONY: run setup build test clean
