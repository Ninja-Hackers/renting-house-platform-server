# H&B Homes

## Renting House platfrom REST API

## About

REST API for House/Apartment Rental

- This repo implements the backend REST API (built in Express + MongoDB).
- A repository for with the frontend (React App) can be found here: https://github.com/Ninja-Hackers/renting-house-platform-client

## Instructions

To run in your computer, follow these steps:

- clone
- install dependencies: `npm install`
- create a `.env` file with the following environment variables
  - ORIGIN, with the location of your frontend app (example, `ORIGIN=https://renting-house-platform.netlify.app`)
  - TOKEN_SECRET: used to sign auth tokens (example, `TOKEN_SECRET=ilovepizza`)
  - CLOUDINARY_NAME: used to upload Images (example, `CLOUDINARY_NAME=ayulvtvzw`)
  - CLOUDINARY_KEY: used to upload Images (example, - CLOUDINARY_KEY=63257790786874281)
  - CLOUDINARY_SECRET: used to upload Images (example, - CLOUDINARY_SECRET=3XR6sDCVskBGDFjXY6vb-2T0da0)
- run the application: `npm run dev`

## API Endpoints

<br/>

**Auth endpoints**

| HTTP verb | Path             | Request Headers               | Request body                                     | Description       |
| --------- | ---------------- | ----------------------------- | ------------------------------------------------ | ----------------- |
| POST      | /api/auth/signup | –                             | { name: String,email: String, password: String } | Create an account |
| POST      | /api/auth/login  | –                             | { email: String, password: String }              | Login             |
| GET       | /api/auth/verify | Authorization: Bearer `<jwt>` | –                                                | Verify jwt        |

<br/>

**House**

| HTTP verb | Path                 | Request Headers               | Request body                                         | Description                                                                                 |
| --------- | -------------------- | ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| POST      | /api/houses          | Authorization: Bearer `<jwt>` | { title: String, description: String }               | Create new house                                                                            |
| GET       | /api/houses          | –                             | –                                                    | Get all houses                                                                              |
| GET       | /api/houses/:houseId | –                             | –                                                    | Get house details                                                                           |
| GET       | /api/my-houses       | –                             | –                                                    | Get list of my Houses                                                                       |
| POST      | /api/houses/:houseId | Authorization: Bearer `<jwt>` | –                                                    | Add Comments and likes to the House(This functionality is restricted to owner of the house) |
| POST      | /api/upload          | Authorization: Bearer `<jwt>` | –                                                    | Upload Images                                                                               |
| PUT       | /api/houses/:houseId | Authorization: Bearer `<jwt>` | { title: String, description: String, tasks: Array } | Update a house(User can update only their own House)                                        |
| DELETE    | /api/houses/:houseId | Authorization: Bearer `<jwt>` | –                                                    | Delete a house (User can delete only their own House)                                       |

<br/>

**Reservation**

| HTTP verb | Path              | Request Headers               | Request body                                                                | Description            |
| --------- | ----------------- | ----------------------------- | --------------------------------------------------------------------------- | ---------------------- |
| POST      | /api/reservations | Authorization: Bearer `<jwt>` | { CheckIn: Date, CheckOut: Date, numberOfGuest: Number, houseId: objectId } | Create new Reservation |
| GET       | /api/reservations | –                             | –                                                                           | Get all Reservations   |

## Demo

Here is the link of deployed frontend React.js App by Netlify: [Renting House Platform](https://renting-house-platform.netlify.app/)

Here is the link of deployed backend Express API: [Renting House API](https://renting-house.adaptable.app)
