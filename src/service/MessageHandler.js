import Broker from "../rabbitmq/Broker.js";

export default class MessageHandler {

    static async login(payload, correlationId) {
        await Broker.produceMessage({ data: payload }, correlationId);
    }

    static async signup(payload, correlationId) {
        await Broker.produceMessage({ data: payload }, correlationId);
    }

    static async error(message, correlationId) {
        await Broker.produceMessage({ error: message }, correlationId);
    }

}
