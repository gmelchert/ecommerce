const express = require('express')
const router = express.Router()
const db = require('../../database/banco')
const bcrypt = require('bcryptjs')

function findUser(email) {
    return new Promise((resolve, reject) => {
        const query_email = `email="${email}"`

        db.select(`SELECT * FROM login WHERE ${query_email}`)
            .then(async result => {
                if (result.length == 1) {
                    const condition = result.length > 0
                    const password = result[0].password
                    const row = result[0]
                    resolve({condition, email, password: password, row})
                } else {
                    resolve({condition: false})
                }
                
            }).catch(err => reject(err))
    })
}

router.post('/', (req, res) => {
    const body = req.body
    const email = body.email
    findUser(email).then(async validation => {
        if (validation.condition) return res.send({
            success: false,
            msg: "Usuário já cadastrado",
            err: "user ja cadastrado"
        })
        let d = new Date()
        let hoje = new Date(d.valueOf() - d.getTimezoneOffset() * 60000)

        //body.password = await bcrypt.hash(body.password, 10)
        const sql = `INSERT INTO login(email,password,createdAt) VALUES (?,?,?)`;
        const values = [body.email, body.password, hoje]
        db.exec(sql, values).then(result => {
            body.password = undefined
            const response = {
                success: true,
                msg: 'Usuário cadastrado com sucesso!',
                payload: body,
                id: result.insertId
            }
            res.send(response)
        }).catch(err => {
            res.send({
                success: false,
                msg: 'Erro ao gravar novo User',
                err: err
            })
        })

    }).catch(err => {
        const response = {
            success: false,
            msg: 'Erro no banco!',
            err: err
        }
        res.send(response)
    })
})

router.post('/authenticate', (req,res) => {
    const email = req.body.email
    const senha = req.body.password
    if (!email || !senha) return res.send({
        success: false,
        msg: 'Usuário não encontrado!',
        err: 'Body incorreto'
    })
    findUser(email).then(async validation => {
        if (!validation.condition) return res.send({
            success: false,
            msg: 'Usuário não encontrado!',
            err: 'User não encontrado'
        })

        if (senha != validation.password) return res.send({
            success: false,
            msg: 'Senha incorreta!',
            err: 'senha nao encontrada'
        })

        return res.send({
            success: true,
            msg: 'ok',
            rows: validation.row
        })
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
    const sql = 'UPDATE login SET email=?, password=? WHERE id='+id
    const values = [payload.email, payload.password]
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

module.exports = app => app.use('/auth', router)