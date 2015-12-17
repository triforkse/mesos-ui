all: test

node_modules: package.json
	npm install --quiet

setup: node_modules

run:
	npm test

.PHONY: setup
