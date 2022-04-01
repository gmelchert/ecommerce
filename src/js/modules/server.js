const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    next()
})
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

require('./routes/clientes')(app)
require('./routes/login')(app)
require('./routes/catalogo')(app)
require('./external/cep')(app)
require('./routes/pedido')(app)

app.listen(8000, () => console.log('Server on!'))