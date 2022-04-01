/**
 * req para login
 * 1 req POST authenticate 
 */
function autenticador() {
    const email = $("#email").val()
    const password = $("#senha").val()
    if (!email || !password) return alert('Falta campos')
    api('auth/authenticate', 'POST', {email, password}).then(resLogin => {
        if (!resLogin.success) return alert(resLogin.msg)
        api(`cliente?loginId=${resLogin.rows.id}`, 'GET').then(res => {
            global.loginID = resLogin.rows.id
            if (!res.success) return global.loginID = undefined
            global.user = res.rows[0]

            const row = res.rows[0]
            const nome = row.nome


            const cabecalho =
                '<li class="nav-item">'+
                '<a href="javascript:loadPage(\'clientePedido\')" class="nav-link text-white">Logado como <b>'+nome.toUpperCase()+'</b></a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<a href="javascript:loadPage(\'login\')" class="nav-link text-white">Sair</a>'+
                '</li>'+
                '<li class="nav-item">'+
                '<span class="badge rounded-pill bg-light text-danger position-absolute ms-4 mt-0" title="5 produto(s) no carrinho"><small>5</small></span>'+
                '<a href="javascript:loadPage(\'carrinho\')" class="nav-link text-white">'+
                '<i class="bi-cart" style="font-size:24px;line-height:24px;"></i>'+
                '</a>'+
                '</li>'

            $("#navegadorCliente").empty().append(cabecalho)
            
            loadPage('clienteDados')
        }).catch(console.log)
    }).catch(console.log)
}