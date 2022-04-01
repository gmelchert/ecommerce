const express = require('express')
const router = express.Router()
const db = require('../../database/banco')
const whereQueryBuilder = require('../../database/queryBuilder').queryBuilderWhere
const queryBuilderOr = require('../../database/queryBuilder').queryBuilderOn

router.get('/', async (req, res) => {
    if (!req.headers.hasOwnProperty('userid')) return res.send({
        success: false,
        msg: 'User ID obrigatório!'
    })
    
    const sql_cart = `SELECT * from carrinho AS car INNER JOIN catalogo AS cat ON car.clienteId = ${req.headers.userid} AND cat.id = car.itemId`
    db.select(sql_cart).then(result_cart => {
        const itens = {}
        result_cart.map(e => {
            if (!itens.hasOwnProperty(e.pedidoId)) itens[e.pedidoId] = [e]
            else itens[e.pedidoId].push(e)
        })
        return itens
    }).then(async itens => {
        const filtro = await whereQueryBuilder(req.query)
        const sql_orders = `SELECT * from pedidos ${filtro}`
        db.select(sql_orders).then(orders => {
            const pedidos = orders.map(order => {
                itens.hasOwnProperty(order.id)
                    ? order.itens = itens[order.id]
                    : order.itens = []
                return order
            })
            res.send({
                success: true,
                rows: pedidos
            })
        }).catch(err => res.send({
            success: false,
            msg: 'Erro no banco pedidos',
            err
        }))
    }).catch(err => res.send({
        success: false,
        msg: 'Erro no banco carrinho',
        err
    }))
})

router.post('/', async (req, res) => {
    const { total, metodoId } = req.body
    const clienteId = req.headers.userid
    const nPedido = Math.floor(Math.random() * (1000 - 1 + 1)) + 1
    const createdAt = new Date()

    const sql = `INSERT INTO pedidos (clienteId, numero, createdAt, total, metodoId) VALUES (?, ?, ?, ?, ?)`
    const values = [ clienteId, nPedido, createdAt, total, metodoId ]
    db.exec(sql, values).then(result => res.send({
        success: true,
        msg: 'GRAVADO!',
        id: result.insertid
    })).catch(err => res.send({
        success: false,
        msg: 'Erro no banco',
        err
    }))
})



module.exports = app => app.use('/pedido', router)