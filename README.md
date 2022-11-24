# Kanon gaming challenge

Hi! Thank you for readme.
In this one you will find 3 pages

- Login -> User will login here
- Register -> User will register here, has a link to login
- Home
  - Has a navigation bar with current logged user and log off.
  - Countries search bar in which you can find countries by code separated by commas.
  - A slot machine. There you will see remaining coins, last game points and the spin action.
- Footer: With my webpage link :D

## Tech-stack

- nextjs -> react framework that allows to create websites with server side rendering, routing and api routes.
- tailwind -> css framework which provides predefined css classes.
- axios -> simple http client library.
- eslint / prettier -> eslint scans code looking for errors. Prettier scans code looking for formats improvements.
- jsonwebtoken -> provide jwt solutions.
- mongoDB -> nosql database based in documents.

## Environment variables

Create `.env` file with the following:

- MONGODB_URI=mongodb+srv://admin:admin@database.hop5a.mongodb.net/?retryWrites=true&w=majority
- MONGO_DB_NAME='casino-app'
- JWT_KEY='something-random'
- START_COINS=20
