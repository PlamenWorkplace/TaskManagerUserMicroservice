# Task manager: User Handler

This microservice handles messages by RabbitMQ, which deal with the user.
It can perform two basic operations, namely logging in and signing out.
In doing so, it authenticates if the right credentials are passed, by comparing them to the database.
