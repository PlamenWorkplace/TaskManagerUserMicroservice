import Broker from "../rabbitmq/Broker.js";
import db from "../firebase/Database.js";
import bcrypt from "bcrypt";

export default class MessageHandler {

    static async login(payload, correlationId) {
        try {
            const doc = await this.getDocByEmail(payload.email);
            if (!doc.exists) {
                throw "User doesn't exist!";
            }
            bcrypt.compare(payload.password, doc.data().password).then(async result => {
                if (result) {
                    await Broker.produceMessage("1", correlationId);
                } else {
                    await Broker.produceMessage("0", correlationId);
                }
            });
        } catch (e) {
            console.error("MessageHandler.login(): ", e);
            await Broker.produceMessage("0", correlationId);
        }
    }

    static async signup(payload, correlationId) {
        try {
            const doc = await this.getDocByEmail(payload.email);
            if (doc.exists) {
                throw "User already exists!"
            }
            payload.password = await bcrypt.hash(payload.password, 10);
            payload.tasks = [];
            await db.collection("Users").doc(payload.email).set(payload);
            await Broker.produceMessage("1", correlationId);
        } catch (e) {
            console.error("MessageHandler.signup(): ", e);
            await Broker.produceMessage("0", correlationId);
        }
    }

    static async getDocByEmail(email) {
        const userRef = db.collection("Users").doc(email);
        let doc;
        await db.runTransaction(async (t) => doc = await t.get(userRef))
        return doc;
    }

}
