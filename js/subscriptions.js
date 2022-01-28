var subscriptionsListView = function(){
    console.log("Loaded subscriptions list")

    let Assinaturas = JSON.parse(localStorage.getItem("assinaturas"))
    let len = Assinaturas.length
    for(let index = 0; index < len; index+=1){
        console.log(Assinaturas[index])
    }

    self.assinaturas = ko.observableArray([])
    self.assinatura = ko.observable('')

    self.titulo = ko.observable('')
    self.produtor = ko.observable('')
    self.previsão = ko.observable('')
    self.precoTotal = ko.observable('')
    self.produtosArray = ko.observableArray([])

    self.checked = ko.observable('')


    self.assinaturas(Assinaturas)

    function checkassinatura(){
        let check = JSON.parse(localStorage.getItem("assinaturas"))

        if(check == [] || check == undefined || check == null){
            self.checked(false)
        }

        else if(check != [] && check != undefined && check != null){
            self.checked(true)
        }
    }

    window.onload = checkassinatura()


    PageTransition = function(){
        window.location.href = "subscription.html"
    }


    getProdutorName = function(titulo){
        console.log(titulo)

        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${titulo}`];
        return produtorSelected["nome"];


    }

    showDetails = function(assinatura){
        console.log(assinatura)
        let listaprodutores = JSON.parse(localStorage.getItem("produtores"));
        let produtorSelected = listaprodutores[`producer${assinatura.productorID}`];

        console.log(assinatura.produtos)

        self.produtor(produtorSelected["nome"])
        self.titulo(assinatura.título)
        self.previsão(assinatura.periodoEntrega)
        self.precoTotal(assinatura.precoTotal)
        self.produtosArray(assinatura.produtos)


    }




}


$(document).ready(function(){
    console.log("running...")
    ko.applyBindings(new subscriptionsListView())
})