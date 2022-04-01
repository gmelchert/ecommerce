// trocar imagem principal
var trocarImagem = el => $("#imgProduto").attr('src', el.src)

/**
 * 1 req GET catalogo
 * param Id do item
 */
api(`catalogo?id=${global.itemId}`).then(res => {
    if (!res.success) return alert(res.msg)
    const e = res.rows[0]
    $("#imgProduto").attr('src', `../img/produtos/${e.img}`)
    $("#imagens").empty()
    for (let c=1; c<=4; c++) {
        const img = 
            '<div class="col-3">'+
            '<img src="../img/produtos/00000'+c+'.jpg" class="img-thumbnail" onclick="trocarImagem(this)">'+
            '</div>'
        $("#imagens").append(img)
    }

    const detalhamento = 
        '<h1>'+e.nome+'</h1>'+
        '<p>'+
        e.descricao+
        '</p>'+
        '<p>'+
        '    Do ut ad quis et qui qui tempor do irure laborum ullamco excepteur. Adipisicing ipsum ad'+
        '    excepteur sit ipsum adipisicing. Ut ut elit proident fugiat. Ad deserunt et consequat'+
        '    aliquip nisi ut dolore sit ut veniam fugiat culpa nulla. Consequat eiusmod ad deserunt ad'+
        '    sunt adipisicing deserunt nulla est cupidatat commodo do. Minim aliquip dolor in deserunt'+
        '    elit officia. Anim duis ullamco cillum nulla voluptate dolore velit ad Lorem adipisicing.'+
        '</p>'+
        '<p>'+
        '    <button class="btn btn-lg btn-danger mb-3 mb-xl-0 me-2">'+
        '        <i class="bi-cart"></i> Adicionar ao Carrinho'+
        '    </button>'+
        '    <button class="btn btn-lg btn-outline-danger">'+
        '        <i class="bi-heart"></i> Adicionar aos Favoritos'+
        '    </button>'+
        '</p>'
    $("#detalhamento").empty().append(detalhamento)
}).catch(console.log)