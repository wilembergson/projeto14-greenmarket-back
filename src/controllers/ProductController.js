import dayjs from "dayjs"
import db from "../db.js"

export async function saveProducts(req, res){
    const product = req.body
    try{
        await db.collection('products').insertOne({
            name: product.name,
            price: product.price,
            image: product.image
        })
        return res.status(201).send('Produto cadastrado.')
    }catch(e){
        return res.sendStatus(500)
    }
}

export async function listProducts(req, res){
    try{
        const list = await db.collection('products').find().toArray()
        return res.status(200).send(list)
    }catch(e){
        return res.sendStatus(500)
    }
}

export async function finishOrder(req, res){
    const body = req.body
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", "").trim()

    const session = await db.collection('session').findOne({token})
    if(!session){
        res.status(401).send(authorization)
        return
    }
    const user = await db.collection('user').findOne({email: session.email})
    try{
        const purchases ={
            products: body.products,
            total: body.total,
            userId: user._id,
            date: getDate()
        }
        await db.collection('orders').insertOne(purchases)
        return res.status(200).send("Compra realizada com sucesso.")
    }catch(e){
        return res.sendStatus(500)
    }
}

export async function ordersList(req, res){
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", "").trim()

    const session = await db.collection('session').findOne({token})
    if(!session){
        return res.status(401).send(authorization)
    }
    const user = await db.collection('user').findOne({email: session.email})
    try{
        const list = await db.collection('orders').find({userId: user._id}).toArray()
        return res.status(200).send(list)
    }catch(e){
        return res.sendStatus(500)
    }
}

function getDate(){
    let day = dayjs().date()
    let month = dayjs().month() + 1
    let year = dayjs().year()

    if(day < 10){
        day =`0${day}`
    }
    if(month < 10){
        month =`0${month}`
    }
    return `${day}/${month}/${year}`
}