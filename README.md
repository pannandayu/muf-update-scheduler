=== Next.js's Documentation ===

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

<br />

=== Developer's Documentation ===

# SLIK Update Scheduler UI

## Big Scope

This project is a scheduler for SLIK update, a (probably) replacement for old update mechanism (AMQ Message Broker)

## Introduction

This is the face of SLIK Update Scheduler, feel free to modify the code

## Setup

### Prerequisities

- Understand JavaScript
- Understand React.js and Next.js (router and folder routing, fetch backend API, dynamic path, etc.)
- Understand TypeScript
- Ensure NPM is installed

**Make sure you understand the basic concept first before going further**

### Installation

To setup development environment, follow these steps:

1. Clone this repository
2. Checkout or switch branch: `update_scheduler_monitoring`
3. Environment variables : Create `.env` file and place in the root folder, environment variables that are needed for this service will be listed below
4. Node modules : `npm install`
5. Run on development mode : `npm run dev`
6. Build project : `npm run build`
7. Run on production mode : `npm start`

## Usage

Once the application is running, you can do these things:

1. Login

- Purpose: Access the UI
- Path: /

2. Signup (ongoing)

- Purpose: Register a person (you)
- Path: /signup

3. Navigate between screening seamlessly

- 3.1 Get list of update logs
  - Purpose: Get all the update logs based on specified date
  - Path: `/screening/:screeningNum`
- 3.2 Get details of the update log
  - Purpose: View detailed information about a specific update log
  - Path: `/screening/:screeningNum/update-info?batch=:batchNum%date=:dateMark`
- 3.3 Select date
  - Purpose: Choose the date for data retrieval
  - Path: `/screening/:screeningNum`
- 3.4 Push update manually
  - Purpose: Trigger SLIK update manually
  - Path: `/screening/:screeningNum`

## Architecture and Tech Stack

### - Architecture

1. Frontend : This UI
2. Backend : SLIK Update Scheduler microservices, available on [this link](https://phabricator.muf.co.id/source/slik_getresult_scr1_nodejs/)

### - Tech Stack

1. Frontend : **React.js - [Next.js](https://koajs.com)(framework) + TypeScript**
2. Backend : **Node.js - [Express](https://expressjs.com), [Apollo](https://apollographql.com/), [Koa](https://koajs.com)**
3. API : **RESTful API & [GraphQL](https://graphql.org/)**

### API Specification

1. /api/login
2. /api/push-update-self
3. /api/push-update-aggregate
4. /graphql -- get all logs for specified date
5. /graphql -- get detailed information of a single log

## Configuration

This service uses environment variables for configuration, here is the list

1. LOGIN_NODE: http://slik-update-scheduler-authentication-dev.apps.ocp4dev.muf.co.id/api/auth/login-submit
2. SIGNUP_NODE: http://slik-update-scheduler-authentication-dev.apps.ocp4dev.muf.co.id/api/auth/signup-submit
3. PUSH_UPDATE_NODE_SC1_SELF: http://slik-update-scheduler-screening-satu-dev.apps.ocp4dev.muf.co.id/api/update
4. PUSH_UPDATE_NODE_SC2_SELF: http://slik-update-scheduler-screening-dua-dev.apps.ocp4dev.muf.co.id/api/update/self
5. PUSH_UPDATE_NODE_SC2_AGGREGATE: http://slik-update-scheduler-screening-dua-dev.apps.ocp4dev.muf.co.id/api/update/aggregate
6. PUSH_UPDATE_NODE_SC3_SELF: http://slik-update-scheduler-screening-tiga-dev.apps.ocp4dev.muf.co.id/api/update/self
7. PUSH_UPDATE_NODE_SC3_AGGREGATE: http://slik-update-scheduler-screening-tiga-dev.apps.ocp4dev.muf.co.id/api/update/aggregate

## Author

- Pannanda Liko Yu - 15997431
