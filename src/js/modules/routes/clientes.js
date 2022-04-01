const express = require('express')
const router = express.Router()
const db = require('../../database/banco')
const whereQueryBuilder = require('../../database/queryBuilder').queryBuilderWhere
const onQueryBuilder = require('../../database/queryBuilder').queryBuilderOn

router.get('/', async (req, res) => {
    const filtro = await whereQueryBuilder(req.query, 'dados.')
    const enderecos = {}
    const sqlAddress = 'SELECT * FROM endereco'
    //const sqlAddress = 'SELECT * FROM endereco '+whereAddress+' ORDER BY clienteId ASC'
    db.select(sqlAddress).then(async address => {
        await Promise.all(address.map(e => {
            if (e.clienteId) {
                enderecos[e.clienteId]
                    ? enderecos[e.clienteId].push(e)
                    : enderecos[e.clienteId] = [e]
            }
        }))
        const sql = 'SELECT * FROM login INNER JOIN dados ON login.id = dados.loginId '+filtro
        db.select(sql).then(result => {
            const rows = []
            
            result.map(e => {
                enderecos[e.id] 
                    ? e.address = enderecos[e.id]
                    : e.address = []
                rows.push(e)
            })
            const response = {
                success: true,
                rows: rows
            }
            res.send(response)
        })
    }).catch(err => res.send({success: false, err: err}))
})

router.get('/endereco', async (req, res) => {
    const filtro = await whereQueryBuilder(req.query)
    const sql = 'SELECT * FROM endereco '+filtro
    db.select(sql).then(result => {
        const response = {
            success: true,
            rows: result
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco!',
            err: err
        }
        res.send(response)
    })
})

router.post('/', (req, res) => {
    if (!req.body) {
        const response = {
            success: false,
            err: 'Erro ao mandar payload'
        }
        return res.send(response)
    }
    const payload = req.body
    const values = [payload.nome, payload.cpf, payload.loginId, payload.dt_nasc, payload.telefone]
    const sql = 'INSERT INTO dados(nome,cpf,loginId, dt_nasc, telefone) VALUES (?,?,?,?,?)'
    db.exec(sql, values).then(result => {
        const response = {
            success: true,
            msg: 'GRAVADO!',
            payload: payload,
            id: result.insertId
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco',
            err: err,
            payload: payload
        }
        res.send(response)
    })  
})

router.post('/endereco/:id', (req, res) => {
    const id = req.params.id
    if (!req.body || !id) {
        const response = {
            success: false,
            err: 'Erro ao mandar payload'
        }
        return res.send(response)
    }
    const payload = req.body

    const cep = payload.cep

    const values = [id, payload.log, payload.uf, cep.replace('-', ''), payload.numero, payload.ref, payload.comp, payload.bairro]
    const sql = 'INSERT INTO endereco(clienteId,logradouro,uf,cep, numero, referencia, complemento, bairro) VALUES (?,?,?,?,?,?,?,?)'
    db.exec(sql, values).then(result => {
        const response = {
            success: true,
            msg: 'GRAVADO!',
            payload: payload,
            id: result.insertId
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco',
            err: err,
            payload: payload
        }
        res.send(response)
    }) 
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const payload = req.body
    if (!id || !payload) {
        const response = {
            success: false,
            err: 'Falta de parametros'
        }
        return res.send(response)
    }
    const sql = 'UPDATE dados SET nome=?, cpf=?, loginId=?, dt_nasc=?, telefone=? WHERE id='+id
    const values = [payload.nome, payload.cpf, payload.loginId, payload.dt_nasc, payload.telefone]
    db.exec(sql,values).then(result => {
        payload.id = id
        const response = {
            success: true,
            msg: 'GRAVADO!',
            payload: payload
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco',
            err: err,
            payload: payload
        }
        res.send(response)
    })  
})

router.put('/endereco/:id', (req, res) => {
    const id = req.params.id
    const payload = req.body
    if (!id || !payload) {
        const response = {
            success: false,
            err: 'Falta de parametros'
        }
        return res.send(response)
    }
    const sql = 'UPDATE endereco SET clienteId=?, logradouro=?, uf=?, cep=?, numero=?,referencia=?,complemento=?,bairro=? WHERE id='+id
    const values = [payload.clienteId, payload.log, payload.uf, payload.cep]
    db.exec(sql,values).then(result => {
        payload.id = id
        const response = {
            success: true,
            msg: 'GRAVADO!',
            payload: payload
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco',
            err: err,
            payload: payload
        }
        res.send(response)
    })  
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    const tabela = 'dados'
    if (!id || !tabela) {
        const response = {
            success: false,
            err: "Parametros incorretos"
        }
        res.send(response)
    }
    const sql = `DELETE FROM ${tabela} where id=${id}`
    db.exec(sql).then(result => {
        const response = {
            success: true,
            msg: 'DELETADO!',
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco',
            err: err
        }
        res.send(response)
    })    
})

router.delete('/endereco/:id', (req, res) => {
    const id = req.params.id
    const tabela = 'endereco'
    if (!id || !tabela) {
        const response = {
            success: false,
            err: "Parametros incorretos"
        }
        res.send(response)
    }
    const sql = `DELETE FROM ${tabela} where id=${id}`
    db.exec(sql).then(result => {
        const response = {
            success: true,
            msg: 'DELETADO!',
        }
        res.send(response)
    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco',
            err: err
        }
        res.send(response)
    })    
})

module.exports = app => app.use('/cliente', router)