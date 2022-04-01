const express = require('express')
const router = express.Router()
const db = require('../../database/banco')
const whereQueryBuilder = require('../../database/queryBuilder').queryBuilderWhere
const onQueryBuilder = require('../../database/queryBuilder').queryBuilderOn

router.get('/', async (req, res) => {
    const filtro = await whereQueryBuilder(req.query, 'catalogo.')
    const sql = req.headers.hasOwnProperty('userid') ?  'SELECT * FROM favoritos AS f RIGHT JOIN catalogo AS c ON (f.itemId = c.id AND f.clienteId = "'+req.headers.userid+'") '+filtro : 'SELECT * FROM catalogo '+filtro
    db.select(sql).then(async result => {
        const rows = []
        await Promise.all(result.map(e => {
            if (req.headers.hasOwnProperty('userid')) {
                e.favorito = e.clienteId !== null
                e.clienteId = undefined
                e.itemId = undefined
            } else {
                e.favorito = false
            }
            rows.push(e)
        }))
        const response = {
            success: true,
            rows: rows
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco!',
            err: err,
        }
        res.send(response)
    })
})

router.get('/carrinho', async (req, res) => {
    if (!req.headers.hasOwnProperty('userid')) return res.send({
        success: false,
        msg: 'Você deve logar antes'
    })
    const filtro = await whereQueryBuilder(req.query, 'catalogo.')
    
    const sql = 'SELECT * FROM carrinho AS car LEFT JOIN catalogo AS cat ON car.itemId= cat.id '+filtro
    db.select(sql).then(result => res.send({
        success: true,
        rows: result
    })).catch(err => res.send({
        success: false,
        msg: 'Erro no banco!',
        err
    }))

})

router.post('/', (req, res) => {
    if (!req.body) {
        const response = {
            success: false,
            err: 'Erro ao mandar payload'
        }
        return res.send(response)
    }
    const { sku, descricao, preco, un, estoque, img, nome } = req.body
    const values = [sku, descricao, preco, un, estoque, img, nome]
    const sql = 'INSERT INTO catalogo(sku,descricao,preco,unidade,estoque, img, nome) VALUES (?,?,?,?,?,?,?)'
    db.exec(sql, values).then(result => {
        const response = {
            success: true,
            msg: 'GRAVADO!',
            payload: req.body,
            id: result.insertId
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco',
            err: err,
            payload: req.body
        }
        res.send(response)
    })  
})

router.post('/carrinho', async (req, res) => {
    if (!req.headers.hasOwnProperty('userid')) return res.send({
        success: false,
        msg: 'Você deve logar antes'
    })
    const { itemId } = req.body, clienteId = req.headers.userid
    const sql = 'INSERT INTO carrinho (itemId, clienteId) VALUES (?, ?)'
    const values = [itemId, clienteId]

    db.exec(sql, values).then(result => res.send({
        success: true,
        payload: req.body,
        id: result.insertId
    })).catch(err => res.send({
        success: false,
        msg: 'Erro ao add ao carrinho!',
        err
    }))
})

router.post('/fav', async (req, res) => {
    const { clienteId, itemId } = req.body
    const values = [clienteId, itemId]
    const sql = 'INSERT INTO favoritos (clienteId, itemId) VALUES (?,?)'
    db.exec(sql, values).then(result => res.send({
        success: true,
        msg: 'GRAVADO!',
        payload: req.body,
        id: result.insertId
    })).catch(err => res.send({
        success: false,
        msg: 'Erro no banco',
        err: err
    }))
})

router.delete('/fav/:id', (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM favoritos WHERE idFavorito='+id
    db.exec(sql).then(result => res.send({
        success: true,
        msg: 'Favorito Deletado!',
        id
    })).catch(err => res.send({
        success: false,
        msg: 'Erro ao Deletar Favorito!',
        err
    }))
})

module.exports = app => app.use('/catalogo', router)