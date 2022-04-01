/**
 * req GET catalogo
 */
api('catalogo', 'GET').then(res => {
    if (!res.success) return alert(res.msg)
    $("#catalogoMain").empty()
    res.rows.map(e => {
        const favorito = e.favorito ? '-fill' : ''

        const item64 = base64(e)

        const htmlEstoque = !e.estoque
            ?   
                '<div class="card-footer">'+
                '<a href="#" class="btn btn-light disabled mt-2 d-block">'+
                '<small>Reabastecendo Estoque</small>'+
                '</a>'+
                '<small class="text-danger">'+
                '<b>Produto Esgotado</b>'+
                '</small>'+
                '</div>'

            : 
                '<div class="card-footer">'+
                '<a href="javascript:addCarrinho(\''+item64+'\')" class="btn btn-danger mt-2 d-block">'+
                '    Adicionar ao Carrinho'+
                '</a>'+
                '<small class="text-success">'+e.estoque+' em estoque</small>'+
                '</div>'

        const html =
            '<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">'+
            '<div class="card text-center bg-light">'+
            '<a href="javascript:favoritar(\''+e.id+'\')" class="position-absolute end-0 p-2 text-danger">'+
            '    <i id="'+e.id+'favorito" idFavorito="'+e.idFavorito+'" class="bi-suit-heart'+favorito+'" style="font-size: 24px; line-height: 24px;"></i>'+
            '</a>'+
            '<a href="javascript:detalheProduto(\''+e.id+'\')">'+
            '    <img src="/img/produtos/'+e.img+'" class="card-img-top">'+
            '</a>'+
            '<div class="card-header">'+
            valueFormatter(e.preco)+
            '</div>'+
            '<div class="card-body">'+
            '<h5 class="card-title">'+e.nome+'</h5>'+
            '<p class="card-text truncar-3l">'+
            e.descricao+
            '</p>'+
            '</div>'+
            htmlEstoque+
            '</div>'+
            '</div>'

        $("#catalogoMain").append(html)
    })

}).catch(console.log)

/**
 * 1 req POST catalogo/fav para favoritar item
 * 2 req DELETE catalogo/fav/id para desfavoritar
 */
function favoritar(itemId) {
    if (!global.hasOwnProperty('user')) return alert('logar antes de favoritar')

    const clienteId = global.user.id
    if ($(`#${itemId}favorito`).hasClass('bi-suit-heart-fill')) {

        const idFavorito = $(`#${itemId}favorito`).attr('idFavorito')

        api(`catalogo/fav/${idFavorito}`, 'DELETE').then(res => {
            if (!res.success) return alert(res.msg)

            $(`#${itemId}favorito`).removeClass('bi-suit-heart-fill').addClass('bi-suit-heart')
            alert(res.msg)

        }).catch(console.log)

    } else {

        api('catalogo/fav', 'POST', { itemId, clienteId }).then(res => {
            if (!res.success) return alert(res.msg)

            $(`#${itemId}favorito`).removeClass('bi-suit-heart').addClass('bi-suit-heart-fill')
            $(`#${itemId}favorito`).attr('idFavorito', res.id)
            alert(res.msg)

        }).catch(console.log)
    } 
}

function addCarrinho(prod64) {
    const e = base64(prod64)
    if (!global.hasOwnProperty('user')) return alert('Logar antes!')
    const itemId  = e.id
    return writeIdb('carrinho', e)
    api('catalogo/carrinho', 'POST', { itemId }).then(res => {
        if (!res.success) return alert(res.msg)
        alert(res.msg)
        loadPage('carrinho')
    })
}

function detalheProduto(id) {
    global.itemId = id
    console.log(global)
    loadPage('produto')
}