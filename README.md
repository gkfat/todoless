# TodoLess

A Todo app.

## Tech stacks

- Nest.js
- Mysql
- Redis
- Casbin

## Features

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
    - [ ] Todos