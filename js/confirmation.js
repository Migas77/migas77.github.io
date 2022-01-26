let confirmationVM = function() {
    console.log("loaded confirmation page")


    let self = this

    var pagamento = localStorage.getItem("pagamento")
    $("input[value='" + pagamento + "']").prop("checked",true)


    let getProducerID = JSON.parse(localStorage.getItem("SelectedProducerID"))
    let produtores = JSON.parse(localStorage.getItem("produtores"))
    let produtorRef = produtores[`producer${getProducerID}`]
    console.log(produtorRef)

    self.nome = ko.observable('')
    self.imagemsrc = ko.observable('')
    self.produtos = ko.observableArray([])
    self.localizacao = ko.observable('')
    self.id = ko.observable('')
    self.rating = ko.observable('')
    self.entrega = ko.observable('')
    self.distancia = ko.observable('')


    self.nome(produtorRef["nome"])
    self.imagemsrc(produtorRef["imagemsrc"])
    self.localizacao(produtorRef["localizacao"])
    self.id(produtorRef["id"])
    self.rating(produtorRef["rating"])
    self.produtos(produtorRef["arrayOfertas"])
    self.entrega(produtorRef["entrega"])
    self.distancia(produtorRef["distancia"])

    

    self.total = ko.computed(function(){
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        let len = cabaz.length
        let totalcabaz = 0;

        //procurar o item no array do cabaz pelo nome
        for(let index = 0; index < len; index+=1){
            totalcabaz += parseFloat(cabaz[index].preco)
            //console.log(cabaz[index].preco, typeof(cabaz[index].preco))
        }
        console.log(produtorRef["entrega"] + totalcabaz)
        return parseInt(produtorRef["entrega"]) + totalcabaz
    })

    self.Itenscabaz = ko.observableArray([])
   

    PageTransition = function(){
        window.location.href = "ProducerProfile.html"
    }

    PageCard = function(){
        window.location.href = "cabazCard.html"
    }

    removeList = function(){
        $('.tabelaprodutos').remove();
    }

    

    getTotal = function(){
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        let len = cabaz.length
        let totalcabaz = 0;

        //procurar o item no array do cabaz pelo nome
        for(let index = 0; index < len; index+=1){
            totalcabaz += parseFloat(cabaz[index].preco)
            //console.log(cabaz[index].preco, typeof(cabaz[index].preco))
        }
        //self.total()
        return totalcabaz

    }



    GetItensCabaz = function(){
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        
        return cabaz
    }






}



$(document).ready(function () { 
    
    console.log('Running...')
    ko.applyBindings(new confirmationVM());
});