import mongoose from 'mongoose'

const connection = {}

async function connect() {
  if (connection.isConnected) {
    console.log('=> already connected')
    return
  }
  if (mongoose.connections.lenght > 0) {
    connection.isConnected = mongoose.connections[0].readyState
    if (connection.isConnected === 1) {
      console.log('=> using previous connection')
      return
    }
    await mongoose.disconnect()
  }
  const db = await mongoose.connect(process.env.MONGODB_URI)
  console.log('=> new connection')
  connection.isConnected = db.connections[0].readyState
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect()
      connection.isConnected = false
      console.log('=> disconnected')
    } else {
      console.log('=> not disconnecting in development')
    }
  }
}

const db = { connect, disconnect }
export default db
