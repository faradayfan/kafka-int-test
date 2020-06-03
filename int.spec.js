var supertest = require('supertest')
const { Kafka } = require('kafkajs')

const {
  KAFKA_HOST,
  KAFKA_TOPIC,
  TEST_URL
} = process.env

const kafka = new Kafka({
  clientId: 'my-app-test',
  ssl: false,
  brokers: [KAFKA_HOST]
})

const consumer = kafka.consumer({ groupId: 'forager-test-runner' })

describe('Testing the tester', () => {

  let expectedMessage

  beforeAll(async () => {
    jest.useFakeTimers()

    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true })
    await consumer.connect()
  })

  afterAll(async () => {
    await consumer.disconnect()
  })

  it('should return a status code of 200 and the body should have the correct structure', async () => {
    await supertest(TEST_URL)
      .get(`/`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(resp => {
        console.log("Resp", resp.body)
        expect(typeof resp.body).toEqual('object')
      })
  })

  it('should connect to kafka and retrieve message', async () => {
    console.log("Topic", KAFKA_TOPIC)

    setTimeout(async () => {
      await consumer.run({
        eachMessage: async ({ KAFKA_TOPIC, partition, message }) => {
          console.log("CONSUMER VALUE", {
            value: message.value.toString(),
          })
          expectedMessage = message.value.toString()
        },
      })
      console.log("Expected", expectedMessage)
      expect(expectedMessage).toBe('Hello KafkaJS user!')
      done()
    }, 5000)
  })
});