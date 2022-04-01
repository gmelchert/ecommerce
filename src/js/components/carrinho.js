/**
 * 1 req GET catalogo/carrinho
 */
//api(`catalogo/carrinho?clienteId=${global.user.id}`, 'GET').then(async res => {

readDB('carrinho').then(async res => {
    if (res.length == 0) return alert('Carrinho vazio')
    $("#produtos").empty()
    const soma = await res.map(e => e.preco).reduce((prev, next) => prev+next)
    await res.map(e => {
        const item64 = base64(e)

        const html =
            '<li class="list-group-item py-3">'+
            '<div class="row g-3">'+
            '<div class="col-4 col-md-3 col-lg-2">'+
            '<a href="#">'+
            '<img src="/img/produtos/'+e.img+'" class="img-thumbnail">'+
            '</a>'+
            '</div>'+
            '<div class="col-8 col-md-9 col-lg-7 col-xl-8 text-left align-self-center">'+
            '<h4>'+
            '<b><a href="#" class="text-decoration-none text-danger">'+
            e.nome+
            '</a></b>'+
            '</h4>'+
            '<h5>'+
            e.descricao+
            '</h5>'+
            '</div>'+
            '<div class="col-6 offset-6 col-sm-6 offset-sm-6 col-md-4 offset-md-8 col-lg-3 offset-lg-0 col-xl-2 align-self-center mt-3">'+
            '<div class="input-group">'+
            '<button class="btn btn-outline-dark btn-sm" onclick="qtdeCarrinho(\''+item64+'\', \'menos\')"  type="button">'+
            '<i class="bi-caret-down" style="font-size: 16px; line-height: 16px;"></i>'+
            '</button>'+
            '<input type="text" id="'+e.id+'" class="form-control text-center border-dark" value="1">'+
            '<button class="btn btn-outline-dark btn-sm" onclick="qtdeCarrinho(\''+item64+'\', \'mais\')" type="button">'+
            '<i class="bi-caret-up" style="font-size: 16px; line-height: 16px;"></i>'+
            '</button>'+
            '<button class="btn btn-outline-danger border-dark btn-sm" onclick="deletar(\''+e.id+'\') type="button">'+
            '<i class="bi-trash" style="font-size: 16px; line-height: 16px;"></i>'+
            '</button>'+
            '</div>'+
            '<div class="text-end mt-2">'+
            '<small class="text-secondary">Valor '+e.unidade+': '+valueFormatter(e.preco)+'</small><br>'+
            '<span class="text-dark" total id="total'+e.id+'">Valor Item: '+valueFormatter(e.preco)+'</span>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</li>'

        $("#produtos").append(html)
    })

    const footer =
        '<li class="list-group-item py-3">'+
        '<div class="text-end">'+
        '<h4 class="text-dark mb-3" id="somaTotal">'+
        'Valor Total: '+valueFormatter(soma)+
        '</h4>'+
        '<a href="javascript:loadPage(\'main\')" class="btn btn-outline-success btn-lg">'+
        'Continuar Comprando'+
        '</a>'+
        '<a href="javascript:loadPage(\'carrinhoItens\')" class="btn btn-danger btn-lg ms-2 mt-xs-3">Fechar Compra</a>'+
        '</div>'+
        '</li>'

    $("#produtos").append(footer)
})

function qtdeCarrinho(item64, op) {
    const el = base64(item64)

    // qtde de um item no carrinho
    const qtde = parseInt($(`#${el.id}`).val())

    if (op == 'mais') {
        if (qtde == el.estoque) return
        $(`#${el.id}`).val(qtde+1)
    } else {
        if (qtde == 1) return
        $(`#${el.id}`).val(qtde-1)
    }

    const novaQtde = parseInt($(`#${el.id}`).val())
    $(`#total${el.id}`).empty().append(`Valor Item: ${valueFormatter(el.preco*novaQtde)}`)
    somaTotal()
}

function deletar(id) {
    api(`catalogo/carrinho/${id}`, 'DELETE').then(res => {
        alert(res.msg)
    })
}

async function somaTotal() {
    const valores = []
    await $('span[total]').each((i, e) => {
        valores.push($(e).text())
    })
    const total = valores.map(e => valueParse(e, 'Valor Item: ')).reduce((prev, next) => prev+next)
    $("#somaTotal").empty().append(`Valor total: ${valueFormatter(total)}`)
}