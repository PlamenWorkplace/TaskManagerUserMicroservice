# Task manager: User Handler

This microservice handles user authentication and creation.
It consumes messages by RabbitMQ, which deal with the user, and immediately sends them back with an appropriate response.
It can perform two basic operations, namely login and signup.
For logging in, it checks if the right credentials are passed by comparing them to the database.
For signing up, it creates a new document with the corresponding user data.
