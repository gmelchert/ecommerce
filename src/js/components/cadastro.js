/**
 * request para cadastrar usuário
 * 1 req - POST login
 * 2 req - POST dados
 * 3 req - GET cep
 * 4 req - POST endereco
 */
function cadastrar() {
    const nome = $("#nome").val(), 
        cpf = $("#cpf").val(), 
        dt_nasc = $("#nasc").val(),
        email = $("#txtEmail").val(),
        tel = $("#tel").val(),
        cep = $("#cep").val(),
        numero = $("#numero").val(),
        comp = $("#comp").val(),
        ref = $("#ref").val(),
        password = $("#senha").val(),
        confirmaSenha = $("#confirmaSenha").val()
    if (password !== confirmaSenha) return alert("senhas diferentes!")
    const bodyLogin = {
        email,
        password,
    }
    api('auth', 'POST', bodyLogin).then(resLogin => {
        if (!resLogin.success) return alert(resLogin.msg)
        const bodyDados = {
            nome,
            cpf,
            "loginId": resLogin.id,
            dt_nasc,
            "telefone": tel
        }

        api(`cliente`, 'POST', bodyDados).then(resDados => {
            if (!resDados.success) return alert(resDados.msg)
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
                api(`cliente/endereco/${resDados.id}`, 'POST', bodyEndereco).then(resEndereco => {
                    if (!resEndereco.success) return alert(resEndereco.msg)
                    return alert('CLIENTE GRAVADO!')
                })
            })
        })
    })
}

function getCep(el) {
    const cep = $(el).val()
    api(`ext/cep/${cep}`).then(res => {
        if (!res.success) return alert(res.msg)
        const e = res.rows[0]
        const html = `${e.logradouro}\n${e.bairro} - ${e.localidade} - ${e.uf}`
        $("#endereco").empty().html(html)
    })
}