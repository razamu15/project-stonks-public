const { Kafka } = require('kafkajs')

// Create the client with the broker list
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
  ssl: true,
  sasl: {
    mechanism:'plain',
    username:'BVODY4UAEMXE626R',
    password:'PIE2g0KllOgOOZXUXLP5+Oa+uMH0d+4lkqZfKKo1sgNo9I9WU+E8hO1rlnx7WrBI'
  }
})


async function main() {
    await producer.connect()
    await producer.send({
        topic: 'test_topic',
        messages: [
            { key: 'key1', value: JSON.stringify({ticker:"GOOG", price:2100, time:"2020-01-01"} )},
            { key: 'key2', value: JSON.stringify({ticker:"AAPL", price:126, time:"2020-06-12"}) }
        ],
    });  
}

const producer = kafka.producer();
let mane = main();
mane
 .then(() => {
    console.log("completed prodcuing messages");
    return;
 })
 .catch((err) => {
     console.error(err);
 })