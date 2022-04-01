$("#nome").val(global.user.nome)
$("#cpf").val(global.user.cpf)
var data = global.user.dt_nasc
$("#data").val(data.split('T')[0])

function atualizaDados() {
    const user = global.user
    const nome = $("#nome").val()
    const cpf = $("#cpf").val()
    const loginId = user.loginId
    const dt_nasc = $("#data").val()
    const telefone = user.telefone

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
        global.user.nome = nome
        global.user.cpf = cpf
        global.user.dt_nasc = dt_nasc
    }).catch(console.log)
}