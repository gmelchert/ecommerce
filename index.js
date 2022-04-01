function loadPage(page) {
    const main = $("#mainContent")

    if (page == '') return false
    fetch(`./modulos/${page}.html`).then(res => res.text())
    .then(html => {
        main.empty().append(html)
        const carrossel = $("#carousel")
            
        page == 'main'
            ? carrossel.css('display', 'block')
            : carrossel.css('display', 'none')
            
    })
    .catch(err => console.log('Failed to fetch page: ', err))
}

if (!global) {
    var global = {}
    global.loginID = ''
}

loadPage('login')

function deslogarUsuario() {
    global = {}
    const cabecalho =
        '<li class="nav-item">'+
        '<a href="javascript:loadPage(\'cadastro\')" class="nav-link text-white">Quero Me Cadastrar</a>'+
        '</li>'+
        '<li class="nav-item">'+
        '<a href="javascript:loadPage(\'login\')" class="nav-link text-white">Entrar</a>'+
        '</li>'+
        '<li class="nav-item">'+
        '<span class="badge rounded-pill bg-light text-danger position-absolute ms-4 mt-0" title="5 produto(s) no carrinho"><small>5</small></span>'+
        '<a href="javascript:loadPage(\'carrinho\')" class="nav-link text-white">'+
        '<i class="bi-cart" style="font-size:24px;line-height:24px;"></i>'+
        '</a>'+
        '</li>'
    $("#navegadorCliente").empty().append(cabecalho)
    loadPage('main')
}