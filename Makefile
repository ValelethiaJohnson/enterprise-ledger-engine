.PHONY: install lint typecheck test audit docker-build

install:
	npm ci

lint:
	npx eslint .

typecheck:
	npx tsc --noEmit

test:
	npx vitest run --coverage

audit:
	npm audit --audit-level=high

docker-build:
	docker build -t enterprise-ledger-engine:latest .
