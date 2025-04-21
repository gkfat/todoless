# TodoLess

A Todo app.

## Tech stacks

- React.js
- Nest.js
- Mysql
- Redis
- Casbin

## Features

- Client
  - Infra
    - [x] Boot app
  - Pages
    - [x] Sign up page
    - [x] Sign in page
    - [x] Dashboard page
    - [x] Accounts page

- Server
  - Infra
    - [x] API trace plugin
    - [ ] Operation log plugin
  - API documentation
    - [x] Swagger
  - Auth policy
    - [x] Account registered with password must verify email with verificationCode to activate account
    - [x] JWT token validation & Auth guard
    - [x] RBAC guard base on Casbin
  - APIs
    - [x] Auth
    - [x] Accounts
    - [x] Privileges
    - [x] Categories
    - [x] Todos