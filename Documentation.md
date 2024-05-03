# SLIK Update Scheduler UI

## Big Scope
This project is a scheduler for SLIK update, a (maybe) to-be temporary or permanent replacement for old update mechanism (using AMQ Message Broker Service)

## Introduction
This is the face of SLIK Update Scheduler, feel free to modify the code

## Setup
To setup development environment, follow these steps:
1. Clone repository         : [Repository Link](https://phabricator.muf.co.id/source/slik_monitoring_reactjs.git)
2. Switch branch            : `update_scheduler_monitoring`
3. Environment variables    : Create `.env` file and place in the root folder, environment variables that are needed for this service will be listed below
4. Node modules             : `npm install`
5. Run on development mode  : `npm run dev`
6. Build project            : `npm run build`
7. Run on production mode   : `npm start`

## Usage
Once the application is running, you can do these things:
1. Login
- Purpose: Access the UI
- Path: /
2. Signup
- Purpose: Register a person (you)
- Path: /signup
3. Navigate between screening seamlessly
  - 3.1 Get list of update logs
    - Purpose: Get all the update logs based on specified date
    - Path: /screening/:screeningNum
  - 3.2 Get details of the update log
    - Purpose: View detailed information about a specific update log
    - Path: /screening/:screeningNum/update-info?batch=:batchNum%date=:dateMark
  - 3.3 Select date
    - Purpose: Choose the date for data retrieval
    - Path: /screening/:screeningNum
  - 3.4 Push update manually
    - Purpose: Trigger SLIK update manually
    - Path: /screening/:screeningNum

## Architecture and Tech Stack

### - Architecture
1. Frontend : This UI
2. Backend  : SLIK Update Scheduler microservices, available on [this link](https://phabricator.muf.co.id/source/slik_getresult_scr1_nodejs/)

### - Tech Stack
1. Frontend : **React.js - Next.js (framework) + TypeScript**
2. Backend  : **Node.js - Express, Apollo, Koa**
3. API      : **RESTful API & GraphQL**

## Configuration
This service uses environment variables for configuration, here are the list
1. LOGIN_NODE: http://slik-update-scheduler-authentication-dev.apps.ocp4dev.muf.co.id/api/auth/login-submit
2. SIGNUP_NODE: http://slik-update-scheduler-authentication-dev.apps.ocp4dev.muf.co.id/api/auth/signup-submit
3. PUSH_UPDATE_NODE_SC1: on-process (per 29/04/2024)
4. PUSH_UPDATE_NODE_SC2: on-process (per 29/04/2024)
5. PUSH_UPDATE_NODE_SC3: on-process (per 29/04/2024)

## Author
- 1 - Draft - Pannanda Liko Yu - 15997431 - 29/04/2024: Initial draft