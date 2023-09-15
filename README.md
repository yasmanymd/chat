## Introduction

Chat is an example of real-time chat application with the following features:  

| Features | 
| --------- |
| *User registration* |
| Input validation for email and password fields. |
| Display error messages for invalid inputs. |
| Disable the submit button until all inputs are valid. |
| Disable the submit button until all inputs are valid. |
| *Real-Time Chat Application* |
| User authentication. |
| Multiple chat rooms. |
| Real-time messaging. |
| Message formatting. |
| Message history. |
| User presence. |
| Notifications. |

---

## How to run it?

### Docker

```shell
$ docker compose up -d
```

Once done below steps you can visit the following endpoints:

* Chat Client: [http://localhost:3000].


### Happy coding

You can open chat folder with VS Code and edit the code. docker-compose file and dockerfiles are configure to debug the code and they have activated hot reload for client and server side.

Note: Watching files is working properly running Docker Desktop, other ways to run docker (Rancher Desktop or WSL) watching files is not working properly. 