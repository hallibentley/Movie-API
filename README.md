# Movie-API

REST API for myFlix, a movie database application. Serves movie, genre, and director data and handles user accounts, authentication, and favorites.

This is the backend. Two frontends consume it:

- [myFlix-client](https://github.com/hallibentley/myFlix-client) — React
- [myFlix-Angular-client](https://github.com/hallibentley/myFlix-Angular-client) — Angular and TypeScript

## Stack

**Runtime:** Node.js, Express  
**Database:** MongoDB with Mongoose ODM  
**Auth:** Passport (`passport-local` and `passport-jwt`), JSON Web Tokens, bcrypt for password hashing  
**Validation:** express-validator  
**Other:** CORS, body-parser, Morgan for request logging

## Authentication

Authentication runs in two stages. `passport-local` verifies username and password against a bcrypt hash on login and issues a signed JWT. Every subsequent request is authenticated by `passport-jwt`, which validates the bearer token before the route handler runs. All endpoints except registration and login require a valid token.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/movies` | All movies |
| GET | `/movies/:title` | A single movie by title |
| GET | `/movies/genre/:genreName` | Genre details |
| GET | `/movies/directors/:name` | Director details |
| POST | `/users` | Register a new user |
| POST | `/login` | Authenticate and receive a JWT |
| GET | `/users` | All users |
| GET | `/users/:username` | A single user |
| PUT | `/users/:username` | Update user details |
| DELETE | `/users/:username` | Deregister a user |
| POST | `/users/:username/movies/:movieId` | Add a movie to favorites |
| DELETE | `/users/:username/movies/:movieId` | Remove a movie from favorites |
| GET | `/documentation` | API documentation |

## Running locally

```bash
git clone https://github.com/hallibentley/Movie-API.git
cd Movie-API
npm install
npm start
```

Requires a MongoDB connection string and a JWT secret as environment variables.

## Trying it with Postman

1. `POST /users` to register
2. `POST /login` with your credentials to receive a JWT
3. Send the token as a bearer token in the `Authorization` header on all other requests

## Note on hosting

Originally deployed to Heroku. Heroku discontinued its free tier in November 2022, so the hosted instance is no longer live. Clone and run locally to use it.
