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