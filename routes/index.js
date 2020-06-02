var express = require('express')
const { Kafka } = require('kafkajs')
var router = express.Router();

const {
  KAFKA_HOST,
  KAFKA_TOPIC
} = process.env

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [KAFKA_HOST]
})

const producer = kafka.producer()

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
    res.json({message: 'success'})
  }
  
  next()
});

module.exports = router;
