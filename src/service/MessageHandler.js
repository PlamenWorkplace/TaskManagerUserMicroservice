import Broker from "../rabbitmq/Broker.js";
import db from "../firebase/Database.js";
import bcrypt from "bcrypt";

export default class MessageHandler {

    static async login(payload, correlationId) {
        const userRef = db.collection("Users").doc(payload.email);
        let doc;
        try {
            await db.runTransaction(async (t) => doc = await t.get(userRef))
            if (!doc.exists) {
                throw "Document doesn't exist!";
            }
        } catch (e) {
            console.log('Transaction error: ', e.message);
            await Broker.produceMessage("0", correlationId);
            return;
        }

        bcrypt.compare(payload.password, doc.data().password).then(async result => {
            if (result) {
                await Broker.produceMessage("1", correlationId);
            } else {
                await Broker.produceMessage("0", correlationId);
            }
        }).catch(e => {
            console.error("Error comparing passwords:", e.message);
        });
    }

    static async signup(payload, correlationId) {
        const userRef = db.collection("Users").doc(payload.email);
        let doc;
        try {
            await db.runTransaction(async (t) => doc = await t.get(userRef))
            if (doc.exists) {
                throw "Document already exists!"
            }
        } catch (e) {
            console.log('Transaction error: ', e.message);
            await Broker.produceMessage("0", correlationId);
            return;
        }

        payload.password = await bcrypt.hash(payload.password, 10);
        await db.collection("Users").doc(payload.email).set(payload);
        await Broker.produceMessage("1", correlationId);
    }

}
