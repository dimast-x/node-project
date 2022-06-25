# Node project

## Description:

A simple backend project that includes: endpoints with different requests, authentication, working with users and their rights, logging implementation and working with the database through orm,

## Used Stack:

- `Express` is pretty similar to golang in its structure from the first sight. And it also allows to create projects from scratch really quickly.
- `JavaScript` is used instead `TypeScript` because the project is pretty small and should be done really quickly. In production it will be better to `TypeScript`.
  Sequelize - as feature-rich ORM for making queries to the database.
- A cloud-hosted Postgres instance by [Supabase](https://supabase.com/) was chosen as the database solution to host just a few tables as it is free for small projects, and easy to deploy and maintain.
- For formatting let's use [Prettier](https://prettier.io/).

## Environment vars that should be set:

```sh
export DB_NAME=postgres
export DB_USER=postgres
export DB_PASS='password'
export DB_HOST='db_host'
export DB_DRIVER=postgres

export AUTH_SECRET=auth-secret
export ERR_LOG_PATH=error.log
export COMBINED_LOG_PATH=combined.log
export PORT=3001
```

## Database

**Items**

| id   | name   | description | createdAt  | updatedAt  |
| ---- | ------ | ----------- | ---------- | ---------- |
| int8 | string | string      | timestampz | timestampz |

**Users**

| id   | username | password | role   | createdAt  | updatedAt  |
| ---- | -------- | -------- | ------ | ---------- | ---------- |
| int8 | string   | string   | string | timestampz | timestampz |

## API Endpoints description

| METHOD | ENDPOINT            | GROUP                     | DESCRIPTION                                                                                                                           |
| ------ | ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/items`            | [public]                  | get public list of items. 3443                                                                                                        |
| POST   | `/items`            | [user, admin, superadmin] | add a new item to the list.                                                                                                           |
| GET    | `/items/:id`        | [public]                  | get an item with specific id.                                                                                                         |
| PUT    | `/items/:id`        | [user, admin, superadmin] | update an item in the list.                                                                                                           |
| DELETE | `/items/:id`        | [user, admin, superadmin] | delete an item in the list.                                                                                                           |
| GET    | `/bitcoin`          | [public]                  | get current Bitcoin price from a third-party provider.                                                                                |
| GET    | `/users`            | [admin, superadmin]       | get list of users and their roles.                                                                                                    |
| GET    | `/users/:id`        | [admin, superadmin]       | get info about a user with specific id.                                                                                               |
| DELETE | `/users/:id`        | [superadmin]              | delete a user.                                                                                                                        |
| POST   | `/users/login`      | [public]                  | login with username and password.                                                                                                     |
| POST   | `/users/register`   | [public]                  | register with username and password.                                                                                                  |
| PUT    | `/users/promote`    | [admin, superadmin]       | promote a user to admin.                                                                                                              |
| PUT    | `/users/fire`       | [superadmin]              | make an admin a user.                                                                                                                 |
| PUT    | `/users/chpassword` | [user, admin, superadmin] | for own password, [admin, superadmin] for other users' passwords - change own password or someones else if the username is specified. |
