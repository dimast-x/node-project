.PHONY: lint format

lint: 
		npx prettier --check ./

format: 
		npx prettier --write ./