/**
 * 1 req GET catalogo
 */
api('catalogo', 'GET').then(res => {
    if (!res.success) {alert(res.msg); return loadPage('main')}
    $("#produtos").empty()
    res.rows.filter(e => e.favorito == true).map(e => {

        const style = { style: 'currency', currency: 'BRL' }

        const htmlEstoque = e.estoque == 0
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
                '<a href="javascript:loadPage(\'carrinho\')" class="btn btn-danger mt-2 d-block">'+
                '    Adicionar ao Carrinho'+
                '</a>'+
                '<small class="text-success">'+e.estoque+' em estoque</small>'+
                '</div>'

        const html = 
            '<div class="col-12 col-sm-6 col-lg-4 col-xl-3">'+
            '<div class="card text-center bg-light">'+
            '<a href="javascript:desfavoritar(\''+e.idFavorito+'\')" class="position-absolute end-0 p-2 text-danger" title="Remover dos favoritos">'+
            '<i class="bi-x" style="font-size: 24px; line-height: 24px;"></i>'+
            '</a>'+
            '<img src="../img/produtos/'+e.img+'" class="card-img-top">'+
            '<div class="card-header">'+
            e.preco.toLocaleString('pt-br', style)+
            '</div>'+
            '<div class="card-body">'+
            '<h5 class="card-title">'+e.nome+'</h5>'+
            '<p class="card-text truncar-3l">'+
            e.descricao+
            '</p>                              '+
            '</div>'+
            htmlEstoque+
            '</div>'+
            '</div>'
        $("#produtos").append(html)
    })
}).catch(console.log)

function desfavoritar(itemId) {
    api(`catalogo/fav/${itemId}`, 'DELETE').then(res => {
        if (!res.success) return alert(res.msg)
        $(`#${itemId}favorito`).removeClass('bi-suit-heart-fill').addClass('bi-suit-heart')
        alert(res.msg)
    }).catch(console.log)
}           