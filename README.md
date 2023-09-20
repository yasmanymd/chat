# Building a Scalable Chat App with Microservices and Docker Compose

This project will delve into the architecture and components of a chat application designed for scalability using a microservices approach. Docker Compose is used for container orchestration. It covers the technologies involved and how each component connects to provide a seamless chat experience.

## Technologies Used

The chat application is built using the following technologies:

- **Frontend/Backend (chat-client)**
  - Tech Stack: Next.js, React, JavaScript/TypeScript, Socket.io-client
  - Docker Image: chat-client:latest
  - Dependencies: React, WebSocket client for real-time communication, PostgreSQL for data storage

- **Chat Server (chat-server)**
  - Tech Stack: Node.js, Socket.IO, Express
  - Docker Image: chat-server:latest
  - Dependencies: Socket.IO for WebSocket handling, Redis for inter-server communication, RabbitMQ as an event bus

- **Message Broker (RabbitMQ)**
  - Tech Stack: RabbitMQ
  - Docker Image: rabbitmq:3-management-alpine
  - Dependencies: Message broker for managing communication between components

- **API (api)**
  - Tech Stack: Node.js, Express, NestJS
  - Docker Image: api:latest
  - Dependencies: Express for routing, WebSocket server for real-time communication, RabbitMQ as an event bus, MongoDB for data storage

- **Database Systems**
  - PostgreSQL (postgres): Relational database for user management
  - MongoDB (mongo): NoSQL database for storing messages
  - Redis (redis): In-memory data structure store for inter-server communication

## How Components Connect

1. **Frontend to API and Chat Server:**
   - The frontend (chat-client) communicates with the API (chat-client) to handle user authentication, room creation (API), and retrieving chat history (API).
   - It also establishes a WebSocket connection to the chat server (chat-server) for real-time messaging.

2. **API to RabbitMQ and Databases:**
   - The API receives HTTP requests from the frontend and processes them accordingly.
   - When a message is sent, the API publishes it to RabbitMQ as an event for further processing by the chat server.
   - The API interacts with MongoDB for message storage and retrieval, and it also communicates with PostgreSQL for user and room management.

3. **Chat Server to RabbitMQ and Databases:**
   - The chat server handles WebSocket connections from clients and manages real-time messaging.
   - When a message is received, the chat server saves it to DB throught RabbitMQ and API.
   - It utilizes Redis for inter-server communication in a scaled-out environment.

4. **Databases to API and Chat Server:**
   - PostgreSQL and MongoDB store user information, room details, and chat messages.
   - The APIs (chat-client and API) communicates with these databases to perform CRUD operations related to users, rooms, and messages.
   - The chat server reads messages from MongoDB and user information from PostgreSQL when required.

5. **Redis for Inter-Server Communication:**
   - Redis is used by both the API and chat server for caching active connections and optimizing message broadcasts.
   - Additionally, Redis enables communication between multiple chat servers in case of application scaling.

## Summary

This chat application employs a microservices architecture with components running in Docker containers managed by Docker Compose. RabbitMQ serves as an event bus for efficient message handling, while Redis facilitates communication between multiple chat server instances in a scaled-out environment. This architecture ensures scalability, flexibility, and maintainability, making it a robust foundation for a chat application poised for growth.

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
docker compose up -d
```

Once done below steps you can visit the following endpoints:

* Chat Client: [http://localhost:3000]
* Chat Server API Docs in Swagger: [http://localhost:3001/api]
* DB Manager for Postgres and MongoDB: [http://localhost:8081]
* RabbitMQ Manager: [http://localhost:15672] (guest/guest)

## Configuration 

The config values are in .env file for development purpose. Is a common practice for managing configuration in applications. However, for sensitive information like passwords, API keys, and other credentials, it's best to utilize a secret manager. 

## Debugging

A launch.json file for debugging is provided also. The configurations are set up for attaching a debugger to running Node.js processes (chat-server and api).

