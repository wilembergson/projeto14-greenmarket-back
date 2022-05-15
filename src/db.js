import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()




let db = null
try{
    const mongoClient = new MongoClient(process.env.MONGO_URL)
    await mongoClient.connect()
    db = mongoClient.db(process.env.DATABASE)
    console.log('Running...')
}catch(e){
    console.log('Não foi possível conectar com o banco de dados.', e)
}

export default db