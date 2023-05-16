const express = require("express")
var app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/pergunta")
const Resposta = require("./database/Resposta")

//Database
connection
    .authenticate()
    .then( () => {
        console.log("Conexão feita com o banco de dados")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })


//EJS
app.set('view engine', 'ejs')
app.use(express.static('public'))

//BodyParser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Rotas
app.get("/", (req,res) => {
    Pergunta.findAll({raw: true, order:[
        ['id', 'desc']
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    })
    
})

app.get("/perguntar", (req,res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then( () => {
        res.redirect("/")
    })
})

app.post("/salvarresposta", (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.perguntaId
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then( () => {
        res.redirect("/pergunta/"+perguntaId)
    })
})

app.get("/pergunta/:id", (req,res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: {id:id}
    }).then(pergunta => {
        if (pergunta != undefined){
           Resposta.findAll({
            where: {perguntaId:pergunta.id},
            order: [['createdAt', 'asc']]
           }).then(respostas => {
            res.render("pergunta", {
                pergunta: pergunta,
                respostas: respostas
           })
            })
        }else{
            res.render("naoencontrada")
       }
    })

})

app.listen(8081, ()=>{
    console.log("App rodando")
})