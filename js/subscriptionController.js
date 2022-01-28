var subscriptionView = function(){
    console.log("loaded signature page ...")

    var self = this

    let listaSign = JSON.parse(localStorage.getItem('OptAssinaturas'))
    self.assinaturas = ko.observableArray([])

    self.assinaturas(listaSign)
    console.log(listaSign)

    getProducerImg = function(id){
        console.log(id)  
        
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${id}`];
        console.log(produtorSelected)
        return produtorSelected["imagemsrc"];
       
        
        
    }
    getProducerNome = function(id){
        console.log(id)  
        
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${id}`];
        return produtorSelected["nome"];
       
        
        
    }

    pageTransition = function(opt){
        //console.log(opt)
        localStorage.setItem("assinatura", JSON.stringify(opt))

        window.location.href = "confirmationSubscription.html"
    }





}

$(document).ready(function(){
    console.log("running")
    ko.applyBindings(new subscriptionView());
});