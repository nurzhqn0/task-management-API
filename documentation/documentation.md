# Task Management Endpoints Documentation

## Object Description

> | Object Name                            | Description              |
> | -------------------------------------- | ------------------------ |
> | <font color="red">**_Tasks_** </font>  | Info about tasks         |
> | <font color="green">**_Auth_** </font> | Info about authorization |

---

## Endpoints

### Related to Tasks

> | HTTP <br> method                        | Route                     | Description                                                                              |
> | --------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
> | <font color="green"> **GET** </font>    | `/tasks`                  | get list of all tasks                                                                    |
> | <font color="green"> **GET** </font>    | `/tasks/{task_id}`        | get tasks with `id = {task_id}`                                                          |
> | <font color="yellow"> **POST** </font>  | `/tasks`                  | create new task                                                                          |
> | <font color="purple"> **PATCH** </font> | `/tasks/{task_id}/status` | update task status with `id = {task_id}`, and avaible statuses `OPEN, IN_PROGRESS, DONE` |
> | <font color="red"> **DELETE** </font>   | `/tasks/{task_id}`        | delete task with `id = {task_id}`                                                        |

### Related to Authorization

> | HTTP <br> method                       | Route          | Description                           |
> | -------------------------------------- | -------------- | ------------------------------------- |
> | <font color="yellow"> **POST** </font> | `/auth/signup` | sign up and create new account        |
> | <font color="yellow"> **POST** </font> | `/auth/signin` | sign in and get bearer token to login |
