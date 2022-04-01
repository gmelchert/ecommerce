function atualizaDados() {
    const password = $('#senha').val()
    if ($("#senhaAtual").val() != global.user.password || password != $("#confSenha").val()) return alert('verifique as suas senhas!')

    const email = global.user.email
    const body = {
        email,
        password
    }
    api(`auth/${global.loginID}`, 'PUT', body).then(res => {
        if (!res.success) return alert(res.msg)
        global.user.password = password
        alert(res.msg)
        loadPage('confirmaNovaSenha')
    }).catch(console.log)
}