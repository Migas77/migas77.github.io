let MarketPlaceVM = function(){
    console.log('MarketPlace loaded...')
    localStorage.setItem("cabaz", JSON.stringify({}))
    //let produtos = JSON.parse(localStorage.getItem('produtos'))
    let self = this

    self.produtos = ko.observableArray(JSON.parse(localStorage.getItem("produtos")))
    console.log(self.produtos())
    self.pesquisado = ko.observable("")
    console.log(localStorage.getItem("OfertasOnly"))
    if((localStorage.getItem("OfertasOnly")) == "true"){
        $("nav, #dropdownMenuButton1, #dropdownMenuButton2").hide()
        $("html").css("pointer-events","none")
        $("input[type='search']").css("pointer-events","auto")
    }else{
        $("nav, #dropdownMenuButton1, #dropdownMenuButton2").show()
        $("html").css("pointer-events","auto")
    }

    self.zero=function(){
        $(".dist").each(function(){
            if(parseFloat($(this).text())>10){
                $(this).parent().parent().parent().hide()
            }else $(this).parent().parent().parent().show()
        })
    }
    self.dez=function(){
        $(".dist").each(function(){
            if(parseFloat($(this).text())<10 || parseFloat($(this).text())>20){
                $(this).parent().parent().parent().hide()
            }else $(this).parent().parent().parent().show()
        })
    }
    self.vinte=function(){
        $(".dist").each(function(){
            if(parseFloat($(this).text())<20 || parseFloat($(this).text())>30){
                $(this).parent().parent().parent().hide()
            }else $(this).parent().parent().parent().show()
        })
    }
    self.trinta=function(){
        $(".dist").each(function(){
            if(parseFloat($(this).text())<30 || parseFloat($(this).text())>40){
                $(this).parent().parent().parent().hide()
            }else $(this).parent().parent().parent().show()
        })
    }
    
    self.noventa=function(){
        $(".avaliacao").each(function(){
            if(parseFloat($(this).text().slice(0,2))<90){
                $(this).parent().parent().parent().hide()
            }else $(this).parent().parent().parent().show()
        })
    }
    self.oitenta=function(){
        $(".avaliacao").each(function(){
            if(parseFloat($(this).text().slice(0,2))>90 || parseFloat($(this).text().slice(0,2))<80){
                $(this).parent().parent().parent().hide()
            }else $(this).parent().parent().parent().show()
        })
    }
    self.setenta=function(){
        $(".avaliacao").each(function(){
            if(parseFloat($(this).text().slice(0,2))>80 || parseFloat($(this).text().slice(0,2))<70){
                $(this).parent().parent().parent().hide()
            }else $(this).parent().parent().parent().show()
        })
    }




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