# Restaurants API

A small NestJS + MongoDB service for managing restaurants and the people who follow them, plus a cuisine-based recommendation endpoint.

## Stack

- NestJS
- TypeScript
- MongoDB with Mongoose
- Swagger for API docs

## Running it

The easiest path is Docker, which spins up the API and a MongoDB instance together:

```bash
cp .env.example .env
docker compose up --build
```

API runs on `http://localhost:3000`, docs on `http://localhost:3000/docs`.

To run it locally without Docker, point `MONGO_URI` at your own Mongo (use `localhost` instead of the `mongo` host) and:

```bash
npm install
npm run start:dev
```

## Endpoints

**Restaurants**
- `POST /restaurants` – create (Arabic + English name, 1–3 cuisines, location)
- `GET /restaurants` – list, filter with `?cuisine=`, paginated with `?page=&limit=`
- `GET /restaurants/:idOrSlug` – fetch by Mongo id or slug
- `GET /restaurants/nearby?lng=&lat=` – restaurants within 1km, nearest first

**Users & follows**
- `POST /users` – create (full name, favorite cuisines)
- `GET /users` – list
- `POST /users/:userId/follows/:restaurantId` – follow
- `DELETE /users/:userId/follows/:restaurantId` – unfollow

**Recommendations**
- `GET /users/:userId/recommendations` – users who share a favorite cuisine, plus the restaurants they follow

## Decisions worth calling out

**Slugs are generated, not supplied.** Create takes the English name and slugifies it. The slug is unique, so a duplicate name comes back as a clean `409` rather than a raw Mongo error.

**One id-or-slug route instead of two.** Slugs can never look like a 24-char ObjectId, so a single `isValidObjectId` check decides which field to query. No ambiguity, no second endpoint.

**Nearby uses `$geoNear`, not `$nearSphere`.** `$nearSphere` would have been enough to filter by distance, but `$geoNear` also hands back the actual distance per restaurant, which is more useful to a client. A `2dsphere` index backs it.

**Follows live in their own collection.** Rather than pushing arrays onto users or restaurants, the relationship is its own document with a compound unique index on `(userId, restaurantId)`. That keeps the many-to-many clean and lets a duplicate follow surface as a `409`.

**Recommendations are a single aggregation.** One pipeline matches users sharing a cuisine, joins their follows, and uses `$facet` to return both lists in one pass — the similar users and the deduped restaurants they follow. It does not exclude restaurants the target already follows, which keeps it faithful to the spec; filtering those out would be a one-line extra `$match`.

## Conventions

- Every response is wrapped in `{ statusCode, message, data }` by a global interceptor; errors go through a global exception filter in the same shape.
- Controllers stay thin and only route. Business logic and entity-to-DTO mapping live in the services.
- Requests and responses each have their own DTOs per module.
