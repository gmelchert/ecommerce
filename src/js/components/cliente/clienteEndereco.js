global.user.address.map(e => {
    $("#cep").val(e.cep)
    $("#numero").val(e.numero)
    $("#comp").val(e.complemento)
    $("#ref").val(e.referencia)
    api(`ext/cep/${e.cep}`).then(res => {
        if (!res.success) return alert(res.msg)
        const e = res.rows[0]
        const html = `${e.logradouro}\n${e.bairro} - ${e.localidade} - ${e.uf}`
        $("#endereco").empty().html(html)
    })
})
/**
 * req para atualizar os dados
 * req PUT auth || PUT cliente
 */
function atualizaDados() {
    const cep = $("#cep").val()
    const numero = $("#numero").val()
    const comp = $("#comp").val()
    const ref = $("#ref").val()

    api(`ext/cep/${cep}`).then(resCep => {
        if (!resCep.success) return alert('Erro ao buscar cep!')
        const e = resCep.rows[0]
        const log = e.logradouro
        const uf = e.uf
        const bairro = e.bairro

        const bodyEndereco = {
            log,
            uf,
            bairro,
            cep,
            numero,
            ref,
            comp
        }
        
        api(`cliente/endereco/${resDados.id}`, 'PUT', bodyEndereco).then(res => {
            if (!res.success) return alert(res.msg)
            alert(res.msg)
            global.user.address.cep = cep
            global.user.address.numero = numero
            global.user.address.complemento = comp
            global.user.address.referencia = ref
        }).catch(console.log)
    }).catch(console.log)
}

/**
 * 1 req GET ext/cep/ pega cep
 */
function getCep(el) {
    const cep = $(el).val()
    api(`ext/cep/${cep}`).then(res => {
        if (!res.success) return alert(res.msg)
        const e = res.rows[0]
        const html = `${e.logradouro}\n${e.bairro} - ${e.localidade} - ${e.uf}`
        $("#endereco").empty().html(html)
    })
}