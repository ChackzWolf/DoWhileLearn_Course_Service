"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConfig = exports.KafkaConfig = void 0;
// utils/kafka.ts
const kafkajs_1 = require("kafkajs");
class KafkaConfig {
    constructor() {
        this.producer = null;
        this.consumer = null;
        this.kafka = new kafkajs_1.Kafka({
            clientId: 'elearning-service',
            brokers: ['localhost:9092'],
            retry: {
                maxRetryTime: 60000, // 60 seconds
            },
            connectionTimeout: 10000, // 10 seconds
            requestTimeout: 25000, // 25 seconds
        });
    }
    static getInstance() {
        if (!KafkaConfig.instance) {
            KafkaConfig.instance = new KafkaConfig();
        }
        return KafkaConfig.instance;
    }
    getProducer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.producer) {
                this.producer = this.kafka.producer();
                yield this.producer.connect();
            }
            return this.producer;
        });
    }
    getConsumer(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.consumer) {
                this.consumer = this.kafka.consumer({
                    groupId,
                    sessionTimeout: 30000,
                    heartbeatInterval: 3000,
                    readUncommitted: false
                });
                yield this.consumer.connect();
            }
            return this.consumer;
        });
    }
    sendMessage(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const producer = yield this.getProducer();
                yield producer.send({
                    topic,
                    messages: [{ value: JSON.stringify(message) }]
                });
                console.log(`Message sent to topic ${topic}:`, message);
            }
            catch (error) {
                console.error(`Error sending message to ${topic}:`, error);
                throw error;
            }
        });
    }
    consumeMessages(groupId, topics, messageHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const consumer = yield this.getConsumer(groupId);
                yield Promise.all(topics.map(topic => consumer.subscribe({ topic })));
                yield consumer.run({
                    eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                        var _b;
                        console.log(`Received message from topic ${topic}:`, (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
                        yield messageHandler(topics, message, topic);
                    })
                });
            }
            catch (error) {
                console.error('Error consuming messages:', error);
                throw error;
            }
        });
    }
}
exports.KafkaConfig = KafkaConfig;
exports.kafkaConfig = KafkaConfig.getInstance();
