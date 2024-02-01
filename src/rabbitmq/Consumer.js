import MassageHandler from "./MessageHandler.js";

export default class Consumer {

    constructor(channel, requestQueueName) {
        this.channel = channel;
        this.requestQueueName = requestQueueName;
    }

    async consumeMessages() {
        this.channel.consume(this.requestQueueName, async message => {
            const { correlationId, replyTo } = message.properties;

            if (correlationId && replyTo) {
                await MassageHandler.handle(JSON.parse(message.content.toString()), correlationId, replyTo);
            } else {
                console.log("Missing properties!");
            }
        }, { noAck: true });
    }
}