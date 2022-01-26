let MarketPlaceVM = function(){
    console.log('MarketPlace loaded...')
    localStorage.setItem("cabaz", JSON.stringify({}))
    //let produtos = JSON.parse(localStorage.getItem('produtos'))
    let self = this

    self.produtos = JSON.parse(localStorage.getItem("produtos"))

    function CreateCabazInical(id){
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${id}`];

        //console.log(produtorSelected)
        let ListaProdutos = produtorSelected["arrayOfertas"]
        console.log(ListaProdutos)

        let len = ListaProdutos.length

        let ArrayCabaz = []

        //let modeloItem = {}
        
        for(let index = 0; index < len; index+=1){
            
            ArrayCabaz.push({"produto" : `${ListaProdutos[index]["produto"]}`, "quantidade" : 0, "preco" :  0.0, "tipo" : `${ListaProdutos[index]["tipo"]}`, "precoPadrao" : `${ListaProdutos[index]["preco"]}`})
            //console.log(ListaProdutos[index]["produto"])
        }

    
        console.log(ArrayCabaz)
        localStorage.setItem("cabaz", JSON.stringify(ArrayCabaz))

    }
    

    GetProdutorNome = function(id) {
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${id}`];
        return produtorSelected["nome"];
    }

    GetProdutorlocalizacao = function(id) {
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${id}`];
        return produtorSelected["localizacao"];
    }

    GetProdutorRating = function(id) {
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${id}`];
        return produtorSelected["rating"];
    }

    PageTrasition = function(produto) {
        //console.log(produto.productorID)
        localStorage.setItem("SelectedProducerID", JSON.stringify(produto.productorID))
        CreateCabazInical(produto.productorID)


        window.location.href = "ProducerProfile.html"
    }
    
    
}
    
    
$(document).ready(function () { 
    console.log('Running...')
    console.log(produtos)
    ko.applyBindings(new MarketPlaceVM());
});