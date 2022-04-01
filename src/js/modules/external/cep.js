const express = require('express')
const router = express.Router()
const phin = require('phin')

router.get('/cep/:cep', async (req, res) => {
    const cep = req.params.cep
    const result = await phin({
        url: `http://viacep.com.br/ws/${cep}/json/`,
        method: 'GET',
        'parse': 'json'

    })
    if (result.hasOwnProperty('erro')) return res.send({
        success: false,
        msg: 'A chamada falhou!',
        err
    })
    //console.log(result)
    return res.send({
        success: true,
        rows: [result.body]
    })
})

module.exports = app => app.use('/ext', router) 