import {connect} from "amqplib";
import Consumer from "./Consumer.js";
import Producer from "./Producer.js";

class Server {

    static instance;

    constructor(producer, consumer, connection, producerChannel, consumerChannel) {
        this.producer = producer;
        this.consumer = consumer;
        this.connection = connection;
        this.producerChannel = producerChannel;
        this.consumerChannel = consumerChannel;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Server();
        }
        return this.instance;
    }

    async initialize() {
        try {
            this.connection = await connect("amqp://localhost");

            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            const { queue: requestQueueName } = await this.consumerChannel
                .assertQueue("UserRequest", {exclusive: true})

            this.producer = new Producer(this.producerChannel);
            this.consumer = new Consumer(this.consumerChannel, requestQueueName);

            await this.consumer.consumeMessages();
        } catch(error) {
            console.log("Error: ", error)
        }
    }

    async produce(data, correlationId, responseQueue) {
        return await this.producer.produceMessage(data, correlationId, responseQueue);
    }
}

export default Server.getInstance();