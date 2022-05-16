import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from'bcrypt'
import jwt from'jsonwebtoken'
import productsRouter from'./src/routes/ProductsRouter.js'
import dotenv from 'dotenv'
dotenv.config()

import db from './src/db.js'

const app = express()
const port = process.env.PORT || 5000;
//json response express
app.use(express.json())
app.use(cors({
    origin: '*',
}));

app.use(productsRouter)

//models
import User from './src/models/User.js'

//rota publica
app.get('/', (req,res) => {
    res.status(200).json({msg: 'Bem vindo a nossa loja!'})
})


//rota privada (após login) checktoken é o middleware que valida login nas rotas privadas
app.get('/user/', checkToken, async (req,res) => {
    const id = res.locals.id
    console.log(id)
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({ msg: 'Usuário não encontrado'})
    }

    res.status(200).json({ user})
})

//middleware checa o token
function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const tokenSplit = authHeader.replace("Bearer ","")
    console.log(tokenSplit);

    if(!tokenSplit){
        return res.status(401).json({msg: 'Acesso negado! Efetue o login.'})
    }

    try{
        const secret = process.env.SECRET
        jwt.verify(tokenSplit, secret)
        const dados = jwt.verify(tokenSplit, secret);
        res.locals = dados;
        console.log(dados)
        next()

    } catch(error){
        res.status(400).send({msg: "Token inválido!"})
    }
}

//login user
app.post("/auth/login", async (req, res) => {
    const {email, password} = req.body
    //validacoes
    if(!email) {
        return res.status(422).json({msg: "O email é obrigatório!!"})
    }
    if(!password) {
        return res.status(422).json({msg: "A senha é obrigatória!!"})
    }

    //check if user exists
    const user = await db.collection('user').findOne({email: email})

    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }
    
    //check if password match
    const checkPassword = await bcrypt.compare(password, user.password)
    
    //inverter logica???
    if(!checkPassword){
        return res.status(404).json({ msg:'Senha inválida'})
    }

    //secret e token
    try{
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
            id: user._id,
            },
            secret,
        )
        const userFound = await db.collection('user').findOne({email: email}) 
        await db.collection('session').insertOne({email, token})
        //envia token se logou com sucesso
        res.status(200).json({msg: 'Autenticação realizada com sucesso',name: user.name, token})
    } catch(err){
        res.status(500).json({msg: 'Erro no servidor, 500!'})
    }
})

//register user: nome, email, senha, senhaconf
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmpassword} = req.body

    //validacao 422 = dados incorretos
    if(!name) {
        return res.status(422).json({msg: "Utilize um nome valido!"})
    }
    if(!email) {
        return res.status(422).json({msg: "O email é obrigatório!!"})
    }
    if(!password) {
        return res.status(422).json({msg: "A senha é obrigatória!!"})
    }

    if(password !== confirmpassword){
        return res.status(422).json({msg: "As senhas não conferem!!"})
    }

    //check user exists
    //const userExists = await User.findOne({email: email})
    const userExists = await db.collection('users').findOne({email: email})

    if(userExists){
        return res.status(422).json({msg: "Utilize outro email!!"})
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    /*const user = new User({
        name,
        email,
        password: passwordHash,
    })*/

    const user = {
        name,
        email,
        password: passwordHash,
    }

    try{
        await db.collection('user').insertOne(user)
        res.status(201).json({msg:'Usuário criado com sucesso.'})
    } catch(error){
        res.status(500).json({msg: 'Erro no servidor, 500!'})
    }
})

//credenciais
/*const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(
        process.env.MONGO_URL
    )
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Conectado ao banco de dados. Rodando em http://localhost:${process.env.PORT}`)
        });
        
    })
    .catch((err) => console.log(err))*/

    
app.listen(process.env.PORT)