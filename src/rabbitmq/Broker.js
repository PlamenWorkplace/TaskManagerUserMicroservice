import {connect} from "amqplib";
import config from "../rabbitmq/config.js";
import MessageHandler from "../service/MessageHandler.js";

class Broker {

    static instance;

    static getInstance() {
        if (!this.instance) {
            this.instance = new Broker();
        }
        return this.instance;
    }

    async initialize() {
        try {
            const connection = await connect(config.url);

            this.producerChannel = await connection.createChannel();
            this.consumerChannel = await connection.createChannel();

            await this.consumerChannel.assertQueue(config.queues.userRequestQueue, {exclusive: true})

            await this.startConsumer();
        } catch(error) {
            console.log("Error: ", error)
        }
    }

    async produceMessage(data, correlationId) {
        this.producerChannel.sendToQueue(
            config.queues.userResponseQueue,
            Buffer.from(JSON.stringify(data)),
            {
                correlationId: correlationId.toString()
            }
        )
    }

    async startConsumer() {
        this.consumerChannel.consume(
            config.queues.userRequestQueue,
            async message => {
                const correlationId = message.properties.correlationId;
                const command = JSON.parse(message.content.toString());
                if (command.name === 'login') {
                    await MessageHandler.login(command.payload, correlationId);
                }
                else if (command.name === 'signup') {
                    await MessageHandler.signup(command.payload, correlationId);
                }
                else {
                    await MessageHandler.error("Invalid Command!", correlationId);
                }
                },
            { noAck: true }
        )
    }

}

export default Broker.getInstance();
