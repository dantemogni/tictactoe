install:
	cd server && npm install && cd ../client && npm install

serve:
	cd server && yarn start

client:
	cd client && yarn start