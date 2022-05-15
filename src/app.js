import express from "express"
import productsRouter from "./routes/ProductsRouter.js"

const app = express()
app.use(express.json())

app.use(productsRouter)

//rota publica
app.get('/home', (req,res) => {
    res.status(200).json({msg: 'Bem vindo a nossa loja!'})
})

app.listen(process.env.PORT)