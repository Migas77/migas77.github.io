var subscriptionView = function(){
    console.log("loaded signature page ...")

    var self = this

    var pagamento = localStorage.getItem("pagamento")
    $("input[value='" + pagamento + "']").prop("checked",true)

    let assinatura = JSON.parse(localStorage.getItem('assinatura'))
    let produtorID = assinatura['productorID']

    let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
    let produtor = listaprodutores[`producer${produtorID}`];
    console.log(produtor)
    
    self.assinatura = ko.observable('')
    self.rating = ko.observable('')
    self.localizacao = ko.observable('')
    self.nome = ko.observable('')
    self.produtos = ko.observableArray([])
    self.entrega = ko.observable('')
    self.totalCabaz = ko.observable('')
    self.epocaColheita = ko.observable('')

    self.produtos(assinatura["produtos"])
    self.totalCabaz(assinatura['preco'])
    self.epocaColheita(assinatura['periodoEntrega'])

    
    self.assinatura(assinatura)

    self.entrega(produtor['entrega'])
    self.rating(produtor['rating'])
    self.nome(produtor['nome'])
    self.localizacao(produtor['localizacao'])


    console.log(assinatura)


    ConfirmSingature = function(){
        let assinaturas = JSON.parse(localStorage.getItem("assinaturas"))
        assinatura["precoTotal"] = (parseFloat(produtor['entrega']) + parseFloat(assinatura['preco']))

        console.log(assinaturas)

        if (assinaturas == null || assinaturas == undefined){
            //let arrAssinaturas = [assinatura]

            localStorage.setItem('assinaturas', JSON.stringify([assinatura]))
        }
        else if(assinaturas != null && assinaturas != undefined){
            assinaturas.push(assinatura)
            localStorage.setItem('assinaturas', JSON.stringify(assinaturas))
        }

        window.location.href = "/marketplace.html"

    }

    

    getTotal = function(){
        return parseFloat(produtor['entrega']) + parseFloat(assinatura['preco'])
    }

    getProducerImg = function(){
        
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${produtorID}`];
        console.log(produtorSelected)
        return produtorSelected["imagemsrc"];
       
        
        
    }
    getProducerNome = function(id){
        console.log(id)  
        
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${id}`];
        return produtorSelected["nome"];
       
        
        
    }

    pageTransition = function(){

        window.location.href = "/marketplace.html"
    }





}

$(document).ready(function(){
    console.log("running")
    ko.applyBindings(new subscriptionView());
});