install:
	cd server && npm install && cd ../client && npm install

start-server:
	cd server && yarn start

start-client:
	cd client && yarn start