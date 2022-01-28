let ProducerVM = function(){
    console.log('Productor page loaded...')

    let self = this

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
    self.distancia = ko.observable('')

    self.nome(produtorRef["nome"])
    self.imagemsrc(produtorRef["imagemsrc"])
    self.localizacao(produtorRef["localizacao"])
    self.id(produtorRef["id"])
    self.rating(produtorRef["rating"])
    self.produtos(produtorRef["arrayOfertas"])
    self.distancia(produtorRef["distancia"])
    console.log(produtorRef["arrayOfertas"])

    self.cabazPreenchido = ko.observable(false)

    function setCabazPreenchido() {
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        let len = cabaz.length

        let quant = 0;


        for(let index = 0; index < len; index+=1){
            quant += parseInt(cabaz[index].quantidade)
        }

        if(quant == 0){
            self.cabazPreenchido(false) }
        else if(quant > 0){
            self.cabazPreenchido(true)

        }


    }

    window.onload = setCabazPreenchido()


    
    

    self.GetItensCabaz = ko.computed(function(){
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        
        return cabaz;
    });

    GetItensQuantCabaz = function(){
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        let total = 0
        let len = cabaz.length

        for(let index = 0; index < len; index+=1){
                total += cabaz[index].quantidade 
                console.log(cabaz[index].quantidade, cabaz[index].preco)
            }
            
        return total
    }

    self.PrecoCabaz = ko.observable('')

    function showCabaz(){
        console.log("show")
        document.getElementsByClassName("listaDoCabaz").innerHTML = `<p>feijao</p>`
    }

    showItens = function(){
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))

        self.Itenscabaz(cabaz)

        return cabaz

    }

    AddItem =  function(produto){ 
        console.log(produto.produto, produto.preco) 

        let nome  = produto.produto

        //procura o cabaz no local storage
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        let len = cabaz.length

        //procurar o item no array do cabaz pelo nome
        for(let index = 0; index < len; index+=1){
            if(cabaz[index].produto == nome){
                cabaz[index].quantidade += 1
                cabaz[index].preco += parseFloat(cabaz[index].precoPadrao)
                cabaz[index].preco = (cabaz[index].preco)

                console.log(cabaz[index].quantidade, cabaz[index].preco)
            }
            
        }


        localStorage.setItem("cabaz", JSON.stringify(cabaz))
        self.cabazPreenchido(true)

        document.location.reload(true)

        

    }

    RemoveItem = function(produto){

        console.log(produto.produto, produto.preco) 

        let nome  = produto.produto
        //let preco = parseFloat(produto.preco)

        //procura o cabaz no local storage
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        let len = cabaz.length

        //procurar o item no array do cabaz pelo nome
        for(let index = 0; index < len; index+=1){
            if(cabaz[index].produto == nome){
                if(cabaz[index].quantidade > 0){

                cabaz[index].quantidade -= 1
                cabaz[index].preco -= parseFloat(cabaz[index].precoPadrao)
                cabaz[index].preco = (cabaz[index].preco)

                }
                else if(cabaz[index].quantidade == 0){
                    cabaz[index].quantidade = 0
                    cabaz[index].preco = parseFloat(0)

                }
                

                console.log(cabaz[index].quantidade, cabaz[index].preco)
                

            }
            
        }

        localStorage.setItem("cabaz", JSON.stringify(cabaz))
        document.location.reload(true)
        //show()


    }

    testeIf = function(){
        let cabaz = JSON.parse(localStorage.getItem("cabaz"))
        let len = cabaz.length

        let quant = 0;
        //self.numeroCabaz


        for(let index = 0; index < len; index+=1){
            quant += parseInt(cabaz[index].quantidade)
            //console.log(cabaz[index].quantidade)
        }

        if(quant == 0){
            console.log(false) }
        else if(quant > 0){
            console.log(true)

        }

        

          
}

    pageTransition = function(){
        window.location.href = "confirmation.html"
    }


    

}






    




    



$(document).ready(function () { 
    console.log('Running...')
    
    //console.log(produtos)
    ko.applyBindings(new ProducerVM());
});