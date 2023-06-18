# Service serves chat apis that allows users interact with LLMs.

- [Introduction](#introduction)
- [Install](#install)
  - [Setup Environment](#setup-environment)
    - [Installation](#installation)
    - [Environment Configuration](#environment-configuration)
    - [Start Database](#start-database)
- [Commands](#commands)
- [Documents](#documents)
- [API Document](#api-document)
- [Technical Specification](#technical-specification)
  - [Database](#database)
    - [Users](#users)  
    - [Chat Histories](#chat-histories)
    - [Sub Collections](#sub-collections)
      - [Conversation](#conversation)
      - [Token](#token)
  - [API Endpoints](#api-endpoints)
      - [POST - /api/v1/public/auth/registration](#post---apiv1publicauthregistration)
      - [POST - /api/v1/public/auth/login](#post---apiv1publicauthlogin)
      - [POST - /api/v1/public/auth/resend-email](#post---apiv1publicauthresend-email)
      - [POST - /api/v1/public/auth/verify-email](#post---apiv1publicauthverify-email)
      - [POST - /api/v1/public/auth/forgot-password](#post---apiv1publicauthforgot-password)
      - [POST - /api/v1/public/auth/reset-password](#post---apiv1publicauthreset-password)
      - [POST - /api/v1/public/auth/refresh](#post---apiv1publicauthrefresh)
      - [PATCH - /api/v1/change-password](#patch---apiv1change-password)
      - [POST - /api/v1/chat](#post---apiv1chat)
      - [GET - /api/v1/users/chat-history](#get---apiv1userschat-history)
  - [Cache Mechanism](#cache-mechanism)
    - [Verification Email](#verification-email) 
    - [Password Change](#password-change)
  - [Send Email](#send-email)
    - [Send Verification/Password Change Email](#send-verificationpassword-change-email)
    - [Send Register Attempt Email](#send-register-attempt-email)

## Introduction
Service serves chat apis that allows users interact with LLMs.

## Install

### Setup Environment

#### Installation

Before starting to explore this application. You have to make sure your machine has a Node version >= 16.

- `Node verion >= 16` (Required)
- `Docker client` (Required)
- Run the command `npm i` to install all the dependencies of this application.

Following `apps/chat-api/.env.example` file, you have to create a new copy file called `apps/chat-api/.env`. This is where the environments variables are situated. The following variables below must be declared in the `.env` file.

#### Environment Configuration

- `NODE_ENV=development or NODE_ENV=production` (The running environment of the application)
- `APP_PORT=4005` (The running port of the application)
- `APP_HOST=0.0.0.0` (The address where hosted application)
- `THROTTLE_TTL=60` (Rate limit time)
- `THROTTLE_LIMIT=10` (Rate limit request count)
- `JWT_KEY=thisislongjwtkeyconfiguration` (Secret key where used to identify the authentication)
- `REFRESH_TOKEN_TTL_LONG_LIVED` (Long-live for the refresh token)
- `REFRESH_TOKEN_TTL` (Expires time given in seconds for the refresh token)
- `JWT_TTL` (Expires time given in seconds for the access token)
- `OPEN_API_KEY` (API Key that obtained from ChatGPT)
- `DATABASE_URL=mongodb://mongo:mongo@localhost:27017/chat-api?authSource=admin` (The string hold all database's credentials)

#### Start Database
We can start the database using docker

```bash
$ docker-compose up -d mongo
```

## Commands

By using the following commands you will make the application work in the proper way.

```bash
# format the code styles
$ npm run format

# lint, checking the coding rules
$ npm run lint

# lint, fix violents coding rules
$ npm run lint:fix

# build chat-api application
$ npm run build:chat-api

# run both unit test and integration testing
$ npm run test

# start the application using Docker development
$ docker-compose up

# force the application running with Docker in the background
$ docker-compose up -d

# development
$ npm run start:chat-api:dev

# production mode
$ npm run start:chat-api:prod
```

## Documents

### API Document

After starting the command `npm run start:chat-api:dev` or `npm run start:chat-api:prod`, you can land on API document page which is`http://${url}:${port}/ws-chat-api/documents` and all documents for the implemented endpoints are situated there.

## Technical Specification

### Database
MongoDB database serves as a storage in the application (MongoDB required).

#### Users
- Collection name: users

| Column        | Type                   | Description                                                                                        | Attributes               | Sensitive |
|---------------|------------------------|----------------------------------------------------------------------------------------------------|--------------------------|-----------|
| _id           | string                 | Automatically generated unique ID of the user                                                      | required (unique)        |           |
| email         | string                 | Unique email of the user                                                                           | required (unique)        |           |
| password      | string                 | The hash characteristic string using bcrypt to store the user's password under the security method | required                 | *         |
| emailVerified | boolean                | Flag indicating if the user's email is verified                                                    | required (default false) |           |
| token         | [Token Object](#token) | Store the refresh token for long live logged in                                                    | optional                 |           |
| createdAt     | date                   | Timestamp indicates when user created (Auto generated)                                             | required                 |           |
| updatedAt     | date                   | Timestamp indicates when user updated (Auto generated)                                             | required                 |           |

#### Chat Histories
- Collection name: chatHistories

| Column        | Type                                | Description                                            | Attributes               | Sensitive |
|---------------|-------------------------------------|--------------------------------------------------------|--------------------------|-----------|
| _id           | string                              | Automatically generated unique ID of the chat history  | required (unique)        |           |
| userId        | string                              | ID of the user reference on Users collection           | required (unique)        |           |
| conversations | [Conversation Array](#conversation) | All the conversations of an given user                 | required                 |           |
| createdAt     | date                                | Timestamp indicates when chat created (Auto generated) | required                 |           |
| updatedAt     | date                                | Timestamp indicates when chat updated (Auto generated) | required                 |           |

#### Sub Collections
##### Conversation

| Column    | Type                 | Description                                                    | Attributes         | Sensitive |
|-----------|----------------------|----------------------------------------------------------------|--------------------|-----------|
| message   | string               | Message of the user who sent that out                          | required           |           |
| type      | enum['user', 'bot']  | Indicates that the user send message or bot send response      | required           |           |
| createdAt | date                 | Timestamp indicates when conversation created (Auto generated) | required           |           |

##### Token

| Column    | Type   | Description                                           | Attributes         | Sensitive |
|-----------|--------|-------------------------------------------------------|--------------------|-----------|
| token     | string | The generated token                                   | required           |           |
| expiredAt | string | Time that token expired                               | required           |           |

### API Endpoints

#### POST - /api/v1/public/auth/registration

> Auth Type: NONE

Users will call this endpoint to register themselves

#### Request Body<!-- omit in toc -->
| Property | Type   | Description     | Specificity  |
|----------|--------|-----------------|--------------|
| email    | string | User's email    | **required** |
| password | string | User's password | **required** |

#### Checks<!-- omit in toc -->
- If a user with the same email exists in the system, send a [registration attempt](#send-register-attempt-email) email to the concerned user, and return a fake success with fake tokens.
- Validate the input data (email, password)

#### Behavior<!-- omit in toc -->
- Hash the user's password using [bcrypt](https://www.npmjs.com/package/bcrypt)
- Create a new user and store in the database
- Generate a email verification token as an uuid
- [Store the verification email token in Redis under `emailVerification:$token` => $userId with a TTL of 5 minutes](#verification-email)
- [Send verification email to the user](#send-verificationpassword-change-email)
- [Generate the access token using `HS256` algorithm via jsonwebtoken package](https://www.npmjs.com/package/jsonwebtoken)
- Generate the refresh token as a random uuid and store in Database with long-live expired date
- Return the access tokens to the user

#### Response<!-- omit in toc -->
201 - Success

```json
{
  "token": "The access token",
  "refreshToken": "The refresh token"
}
```
---

#### POST - /api/v1/public/auth/login

> Auth Type: NONE

Credentials based login

#### Request Body<!-- omit in toc -->
| Property | Type   | Description     | Specificity  |
|----------|--------|-----------------|--------------|
| email    | string | User's email    | **required** |
| password | string | User's password | **required** |

#### Checks<!-- omit in toc -->
- There must be a user with that email
- That user's password must match with a hash of the given password
- Validate the input data (email, password)

#### Behavior<!-- omit in toc -->
- Return the access tokens to the user

#### Response<!-- omit in toc -->
401 - errorCode: wrong-credentials

201 - Success

```json
{
  "token": "The access token",
  "refreshToken": "The refresh token"
}
```
---

#### POST - /api/v1/public/auth/resend-email

> Auth Type: NONE

Users can call this endpoint to initiate the email verification flow

#### Request Body<!-- omit in toc -->
| Property | Type   | Description     | Specificity  |
|----------|--------|-----------------|--------------|
| email    | string | User's email    | **required** |

#### Checks<!-- omit in toc -->
- A user exists with that email. If no user exist with that email, a fake success response should be returned.

#### Behavior<!-- omit in toc -->
- Generate a email verification token as an uuid
- [Store the verification email token in Redis under `emailVerification:$token` => $userId with a TTL of 5 minutes](#verification-email)
- [Send verification email to the user](#send-verificationpassword-change-email)

#### Response<!-- omit in toc -->
201 - Success

```json
{
  "success": true
}
```
---

#### POST - /api/v1/public/auth/verify-email

> Auth Type: NONE

Users can call this endpoint to verify their email using the email verification flow

#### Request Body<!-- omit in toc -->
| Property | Type   | Description                                          | Specificity  |
|----------|--------|------------------------------------------------------|--------------|
| token    | string | Token sent by email in the email verification flow   | **required** |

#### Checks<!-- omit in toc -->
- There must be an entry in Redis for `emailVerification:$token`

#### Behavior<!-- omit in toc -->
- Fetch the user's id from Redis based on key `emailVerification:$token`
- Set the user's email as verified
- Return the access tokens to the user

#### Response<!-- omit in toc -->
201 - Success

```json
{
  "token": "The access token",
  "refreshToken": "The refresh token"
}
```
---

#### POST - /api/v1/public/auth/forgot-password

> Auth Type: NONE

Users can call this endpoint to initiate the reset password flow

#### Request Body<!-- omit in toc -->
| Property | Type   | Description     | Specificity  |
|----------|--------|-----------------|--------------|
| email    | string | User's email    | **required** |

#### Checks<!-- omit in toc -->
- A user exists with that email. If no user exist with that email, a fake success response should be returned.

#### Behavior<!-- omit in toc -->
- Generate a password change token as an uuid
- [Store the password change email token in Redis under `passwordChange:$token` => $userId with a TTL of 5 minutes](#password-change)
- [Send password change email to the user](#send-verificationpassword-change-email)

#### Response<!-- omit in toc -->
201 - Success

```json
{
  "success": true
}
```
---

#### POST - /api/v1/public/auth/reset-password

> Auth Type: NONE

Users can call this endpoint to change their passwords using the password reset flow

#### Request Body<!-- omit in toc -->
| Property | Type   | Description                                    | Specificity  |
|----------|--------|------------------------------------------------|--------------|
| token    | string | Token sent by email in the reset password flow | **required** |
| password | string | The new password to set                        | **required** |

#### Checks<!-- omit in toc -->
- There must be an entry in Redis for `passwordChange:$token`

#### Behavior<!-- omit in toc -->
- Fetch the user's id from Redis based on key `passwordChange:$token`
- Update the user's password hash
- Return the access tokens to the user

#### Response<!-- omit in toc -->
201 - Success

```json
{
  "token": "The access token",
  "refreshToken": "The refresh token"
}
```
---

#### POST - /api/v1/public/auth/refresh

> Auth Type: NONE

Refresh a user's access token

#### Request Body<!-- omit in toc -->
| Property     | Type   | Description             | Specificity  |
|--------------|--------|-------------------------|--------------|
| refreshToken | string | User's current password | **required** |

#### Checks<!-- omit in toc -->
- The refreshToken must be provided

#### Behavior<!-- omit in toc -->
- Check in the database that the refresh token is valid
- Return the access tokens to the user

#### Response<!-- omit in toc -->
200 - Success

```json
{
  "token": "The access token",
  "refreshToken": "The refresh token"
}
```
---


#### PATCH - /api/v1/change-password

> Auth Type: JWT

Users can call this endpoint to change their passwords

#### Request Body<!-- omit in toc -->
| Property        | Type   | Description                    | Specificity  |
|-----------------|--------|--------------------------------|--------------|
| currentPassword | string | User's current password        | **required** |
| password        | string | User's new password            | **required** |

#### Checks<!-- omit in toc -->
- The user must have a verified email
- If the user is using fake tokens return the same error as for an unverified email
- The hash of `currentPassword` must match with the store password hash

#### Behavior<!-- omit in toc -->
- Update the user's password hash
- Return the access tokens to the user

#### Response<!-- omit in toc -->
200 - Success

```json
{
  "token": "The access token",
  "refreshToken": "The refresh token"
}
```
---

#### POST - /api/v1/chat

> Auth Type: JWT

Users can call this endpoint to interact with the LLMs

#### Request Body<!-- omit in toc -->
| Property | Type   | Description    | Specificity  |
|----------|--------|----------------|--------------|
| message  | string | User's message | **required** |

#### Checks<!-- omit in toc -->
- There must be the message in body

#### Behavior<!-- omit in toc -->
- Send that message to the LLMs using [LangchainJS](https://js.langchain.com/docs/modules/models/chat/integrations) 
- When ever received the response from LLMs via LangchainJS, store that message and the response to DB under authenticated user
- Return the response to the user

#### Response<!-- omit in toc -->
201 - Success

```json
{
  "response": "This is the OpenAPI"
}
```
---

#### GET - /api/v1/users/chat-history

> Auth Type: JWT

Users can call this endpoint to get all the chat history for a given user

#### Request Query<!-- omit in toc -->
| Property | Type   | Description                                   | Specificity  |
|----------|--------|-----------------------------------------------|--------------|
| page     | number | Page where client want to fetch (Example: 1)  | **optional** |
| size     | number | Size where client want to fetch (Example: 10) | **optional** |

#### Checks<!-- omit in toc -->
- User must be authenticated

#### Behavior<!-- omit in toc -->
- Fetch the chat history for a given authenticated user
- Return the chat history data to the user

#### Response<!-- omit in toc -->
201 - Success

```json
{
  "conversations": [
    {
      "message": "Hey bro, this is test 19",
      "type": "user"
    },
    {
      "message": "That is good mate Hey bro, this is test 20",
      "type": "bot"
    }
  ],
  "total": 2,
  "currentPage": 1,
  "size": 10,
  "lastPage": null,
  "nextPage": null,
  "prevPage": null
}
```
---


### Cache Mechanism
We use Redis to cache the information that don't need to touch in DB. The Redis should follow standard methods, commands from the [docs](https://redis.io/docs/)

#### Verification Email

| Key                        | Type   | Value                | Expires time | Redis Method                                    |
|----------------------------|--------|----------------------|--------------|-------------------------------------------------|
| `emailVerification:$token` | string | Id of the given user | 5 minutes    | [Use Redis Set](https://redis.io/commands/set/) |

#### Password Change

| Key                       | Type   | Value                | Expires time | Redis Method                                    |
|---------------------------|--------|----------------------|--------------|-------------------------------------------------|
| `passwordChange:$token`   | string | Id of the given user | 5 minutes    | [Use Redis Set](https://redis.io/commands/set/) |

### Send Email
There is a mail service will serve to send email purposes

#### Send Verification/Password Change Email

| Content | Type   | Value                            |
|---------|--------|----------------------------------|
| Token   | string | A random token generated by uuid |

#### Send Register Attempt Email

| Content                                         | Type   |
|-------------------------------------------------|--------|
| A user try to login using your email. It's you? | string |