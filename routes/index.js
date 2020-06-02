var express = require('express')
const { Kafka } = require('kafkajs')
var router = express.Router();

const {
  KAFKA_HOST,
  KAFKA_TOPIC
} = process.env

console.log({
  KAFKA_TOPIC,
  KAFKA_HOST
})

const kafka = new Kafka({
  clientId: 'my-app',
  ssl: false,
  brokers: [KAFKA_HOST]
})

const producer = kafka.producer()

const consumer = kafka.consumer({ groupId: 'forager-producer' })

consumer.connect().then(async ()=>{
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })
})


router.get('/', async function(req, res, next) {
  try {
    await producer.connect()
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [
        { value: 'Hello KafkaJS user!' },
      ],
    })

    res.json({message: 'success'})
  } catch (error) {
    res.json({message: 'error', stack: error.stack})
  }
});



module.exports = router;
