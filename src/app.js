require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

//models
const User = require('./models/User')

//rota publica
app.get('/home', (req,res) => {
    res.status(200).json({msg: 'Bem vindo a nossa loja!'})
})

/*credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.vlnix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(3000)
        console.log('Conectado ao banco de dados.')
    })
    .catch((err) => console.log(err))

//rota privada (após login) checktoken é o middleware que valida login nas rotas privadas
app.get('/user/:id', checkToken, async (req,res) => {
    const id = req.params.id
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({ msg: 'Usuário não encontrado'})
    }

    res.status(200).json({ user})
})



//middleware checa o token
function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split("")[1]

    if(!token){
        return res.status(401).json({msg: 'Acesso negado! Efetue o login.'})
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
const user = await User.findOne({email: email})

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
        const secret =process.env.SECRET

        const token = jwt.sign(
            {
            id: user._id,
            },
            secret,
            )
            //envia token se logou com sucesso
            res.status(200).json({msg: 'Autenticação realizada com sucesso', token})
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
    const userExists = await User.findOne({email: email})

    if(userExists){
        return res.status(422).json({msg: "Utilize outro email!!"})
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try{

        await user.save()
        res.status(201).json({msg:'Usuário criado com sucesso.'})



    } catch(error){
        res.status(500).json({msg: 'Erro no servidor, 500!'})
    }

})*/

app.listen(process.env.PORT, ()=>console.log('Connected on port', process.env.PORT))