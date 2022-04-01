async function queryBuilderWhere(params) {
    const key = Object.keys(params)
    const value = Object.values(params)
    let queryStr = ''

    if (key.length > 1) {
        queryStr += 'WHERE '
        const conditions = []
        await Promise.all(key.map((e, i) => {
            const query = `${e}= "${value[i]}"`
            if (e != 'search') conditions.push(query)
            if (i == key.length-1) return conditions.join(" AND ")
        })).then(result => {
            result.map(e => {
                if (e) queryStr += e
            })
        })
        return queryStr
    } else if (key.length == 1 && key[0] != 'search') {
        queryStr += `WHERE ${key[0]}= "${value[0]}"`
        return queryStr
    } else return queryStr
}

async function queryBuilderOn(params, tabela='') {
    const key = Object.keys(params)
    const value = Object.values(params)
    let queryStr = ''

    if (key.length > 1) {
        queryStr += 'AND '
        const conditions = []
        await Promise.all(key.map((e, i) => {
            const query = `${tabela+e}= "${value[i]}"`
            conditions.push(query)
            if (i == key.length-1) return conditions.join(" AND ")
        })).then(result => {
            result.map(e => {
                if (e) queryStr += e
            })
        })
        return queryStr
    } else if (key.length == 1) {
        queryStr += `AND ${tabela+key[0]}= "${value[0]}"`
        return queryStr
    } else return queryStr
}

async function queryBuilderOr(params, campo) {
    if (params.length == 0) return ''
    let queryStr = ''
    if (params.length == 1) return `WHERE ${campo}= ${params[0]}`

    await Promise.all(key.map((e, i) => {
        const query = `${e}= "${value[i]}"`
        if (e != 'search') conditions.push(query)
        if (i == key.length-1) return conditions.join(" AND ")
    }))
    
}

module.exports = { queryBuilderWhere, queryBuilderOn, queryBuilderOr }