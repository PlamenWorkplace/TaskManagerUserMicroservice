import Server from "./Server.js";

export default class MessageHandler {
    static async handle(data, correlationId, replyTo) {
        await Server.produce(data, correlationId, replyTo)
    }
}