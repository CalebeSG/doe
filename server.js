const express = require('express')
const server = express()

const nunjucks = require('nunjucks')
const Pool = require('pg').Pool

// configurando servidor para apresentar arquivos staticos
server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

// configurando conexão com banco de dados
const db = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

nunjucks.configure("./", {
  express: server,
  noCache: true
})

server.get('/', (req, res) => {
  db.query("SELECT * FROM donors", (err, result) => {
    if(err) return res.send("erro ao buscar dados do banco")

    const donors = result.rows
    return res.render("index.html", { donors })
  })
})

server.post('/', (req, res) => {
  const { name, email, blood } = req.body

  if(name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios")
  }

  const query = `INSERT INTO donors (name, email, blood) 
                 VALUES ($1, $2, $3)`

  db.query(query, [name, email, blood], (err) => {
    if(err) return res.send("erro no banco de dados.")
  })

  return res.redirect("/")
})

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000!")
})