export default class Producer {

    constructor(channel) {
        this.channel = channel;
    }

    async produceMessage(data, correlationId, responseQueue) {
        this.channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(data)),
            {
                correlationId: correlationId
            }
            )
    }
}