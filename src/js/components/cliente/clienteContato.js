$("#email").val(global.user.email)
$("#tel").val(global.user.telefone)

/**
 * req para atualizar os dados
 * req PUT auth || PUT cliente
 */
function atualizaDados(el, campo) {
    if (campo === 'email') {
        const email = $(el).val()
        const password = global.user.password
        const body = {
            email,
            password
        }
        api(`auth/${global.loginID}`, 'PUT', body).then(res => {
            if (!res.success) return alert(res.msg)
            global.user.email = email
            alert(res.msg)
        }).catch(console.log)
    } else {
        const user = global.user
        const nome = user.nome
        const cpf = user.cpf
        const loginId = user.loginId
        const dt_nasc = user.dt_nasc
        const telefone = $(el).val()

        const body = {
            nome,
            cpf,
            loginId,
            dt_nasc,
            telefone
        }
        api(`cliente/${user.id}`, 'PUT', body).then(res => {
            if (!res.success) return alert(res.msg)
            alert(res.msg)
            global.user.telefone = telefone
        }).catch(console.log)
    }
}