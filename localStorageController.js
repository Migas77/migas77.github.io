/*let produtosMP = {'produtos':[
    {'item' : 'lettuce', "imgSrc" : 'pictures/lettuce.jpg'},
    {'item' : 'carrots', "imgSrc" : 'pictures/carrot.jpg'},
    {'item' : 'corn', "imgSrc" : 'pictures/corn.jpg'}
]}
*/
let produtos = [
    {"produto" : "Milho" , "ImagemSrc" : "../pictures/corn.jpg", "id" : "65", "productorID" : "111", "preco" : "2.65", "tipo" : "vegetal","distancia": "25km"},
    {"produto" : "Feijão" , "ImagemSrc" : "../pictures/beans.jpg", "id" : "23", "productorID" : "111", "preco" : "3.65", "tipo" : "semente","distancia": "25km"},

    {"produto" : "Cenoura" , "ImagemSrc" : "../pictures/carrot.jpg", "id" : "34", "productorID" : "222", "preco" : "3.85", "tipo" : "raiz","distancia": "32km"},
    {"produto" : "Arroz" , "ImagemSrc" : "../pictures/rice.jpg", "id" : "11", "productorID" : "222", "preco" : "4.55", "tipo" : "semente","distancia": "32km"},

    {"produto" : "limão" , "ImagemSrc" : "../pictures/lime.jpg", "id" : "23", "productorID" : "111", "preco" : "3.05", "tipo" : "fruta","distancia": "25km"},
    {"produto" : "pimentão" , "ImagemSrc" : "../pictures/redpepper.jpg", "id" : "23", "productorID" : "111", "preco" : "1.20", "tipo" : "fruta","distancia": "25km"},

    {"produto" : "abacaxi" , "ImagemSrc" : "../pictures/pineapple.jpg", "id" : "11", "productorID" : "222", "preco" : "5.55", "tipo" : "fruta","distancia": "32km"},
    {"produto" : "Abóbora" , "ImagemSrc" : "../pictures/pump.jpg", "id" : "11", "productorID" : "222", "preco" : "6.30", "tipo" : "fruta","distancia": "32km"},

    {"produto" : "Alface" , "ImagemSrc" : "../pictures/lettuce.jpg", "id" : "39", "productorID" : "333", "preco" : "4.75", "tipo" : "vegetal","distancia": "11km"},
    {"produto" : "Morango" , "ImagemSrc" : "../pictures/morango.jpg", "id" : "90", "productorID" : "333", "preco" : "8.95", "tipo" : "fruta","distancia": "11km"},
    {"produto" : "Laranja" , "ImagemSrc" : "../pictures/orange.jpg", "id" : "90", "productorID" : "333", "preco" : "3.15", "tipo" : "fruta","distancia": "11km"},
    {"produto" : "cogumelo portobelo" , "ImagemSrc" : "../pictures/mushroom.jpg", "id" : "90", "productorID" : "333", "preco" : "2.85", "tipo" : "cogumelo","distancia": "11km"},

    {"produto" : "Couve" , "ImagemSrc" : "../pictures/couve.jpg", "id" : "41", "productorID" : "444", "preco" : "4.20", "tipo" : "vegetal", "distancia": "18km"},
    {"produto" : "Espinafre" , "ImagemSrc" : "../pictures/espinafre.jpg", "id" : "41", "productorID" : "444", "preco" : "4.80", "tipo" : "vegetal", "distancia": "18km"},

    {"produto" : "Castanha" , "ImagemSrc" : "../pictures/castanha.jpg", "id" : "58", "productorID" : "555", "preco" : "5.00", "tipo" : "castanhas", "distancia": "9km"},
    {"produto" : "Cenoura" , "ImagemSrc" : "../pictures/cenoura2.jpg", "id" : "58", "productorID" : "555", "preco" : "3.90", "tipo" : "raizes", "distancia": "9km"},

    {"produto" : "cebola" , "ImagemSrc" : "../pictures/cebola.jpg", "id" : "41", "productorID" : "444", "preco" : "2.30", "tipo" : "legume", "distancia": "18km"},
    {"produto" : "pimento" , "ImagemSrc" : "../pictures/pimento.jpg", "id" : "41", "productorID" : "444", "preco" : "4.30", "tipo" : "legume", "distancia": "18km"},

    {"produto" : "Beterraba" , "ImagemSrc" : "../pictures/beterraba.jpg", "id" : "58", "productorID" : "555", "preco" : "3.20", "tipo" : "legume", "distancia": "9km"},
        {"produto" : "Tomate" , "ImagemSrc" : "../pictures/tomate.jpg", "id" : "58", "productorID" : "555", "preco" : "3.45", "tipo" : "fruta", "distancia": "9km"}

]      
//localStorage.setItem("MPproducts", JSON.stringify(prod))

opcoesAssinaturas =[{"título" : "Cenoura,Beterraba e Tomate mais do que frescos", "productorID" : "555", 'preco' : "21.85", "periodoEntrega" : "11/03/2022 - 21/03/2022","produtos" : [{
    "produto" : "Cenoura" , "ImagemSrc" : "../pictures/cenoura2.jpg", "id" : "58", "productorID" : "555", "preco" : "3.90", "tipo" : "raizes","quantidade" : "8"},
    {"produto" : "Beterraba" , "ImagemSrc" : "../pictures/beterraba.jpg", "id" : "58", "productorID" : "555", "preco" : "3.20", "tipo" : "legume", "quantidade" : "6"},
    {"produto" : "Tomate" , "ImagemSrc" : "../pictures/tomate.jpg", "id" : "58", "productorID" : "555", "preco" : "3.45", "tipo" : "fruta", "quantidade" : "9"},
    
    ]},
    {"título" : "Cebolas & Pimentos", "productorID" : "555", 'preco' : "11.85", "periodoEntrega" : "13/05/2022 - 12/06/2022","produtos" : [
    {"produto" : "cebola" , "ImagemSrc" : "../pictures/cebola.jpg", "id" : "58", "productorID" : "444", "preco" : "2.30", "tipo" : "legume", "distancia": "9km",  "quantidade" : "10"},
    {"produto" : "pimento" , "ImagemSrc" : "../pictures/pimento.jpg", "id" : "58", "productorID" : "444", "preco" : "4.30", "tipo" : "legume", "distancia": "9km", "quantidade" : "7"}
        
    ]},

    {"título" : "Feijão e limão na mão", "productorID" : "111", 'preco' : "13.00", "periodoEntrega" : "25/01/2022 - 01/03/2022","produtos" : [
    {"produto" : "Feijão" , "ImagemSrc" : "../pictures/beans.jpg", "id" : "23", "productorID" : "111", "preco" : "3.65", "tipo" : "semente","distancia": "25km",   "quantidade" : "40"},
    {"produto" : "limão" , "ImagemSrc" : "../pictures/lime.jpg", "id" : "23", "productorID" : "111", "preco" : "3.05", "tipo" : "fruta","distancia": "25km",   "quantidade" : "10"}
                
    ]},
    {"título" : "Ananás do verão", "productorID" : "222", 'preco' : "16.00", "periodoEntrega" : "11/06/2022 - 14/07/2022","produtos" : [
        {"produto" : "abacaxi" , "ImagemSrc" : "../pictures/pineapple.jpg", "id" : "11", "productorID" : "222", "preco" : "5.55", "tipo" : "fruta","distancia": "32km", "quantidade" : "6"}
                    
    ]},
    {"título" : "Frutas vermelhas do Edu", "productorID" : "333", 'preco' : "18.50", "periodoEntrega" : "01/09/2022 - 01/10/2022","produtos" : [
        {"produto" : "Morango" , "ImagemSrc" : "../pictures/morango.jpg", "id" : "90", "productorID" : "333", "preco" : "8.95", "tipo" : "fruta","distancia": "11km", "quantidade" : "15"},
        {"produto" : "Amoras" , "ImagemSrc" : "../pictures/amora.jpg", "id" : "90", "productorID" : "333", "preco" : "1.15", "tipo" : "fruta","distancia": "11km", "quantidade" : "15"},
        {"produto" : "framboesas" , "ImagemSrc" : "../pictures/framb.jpg", "id" : "90", "productorID" : "333", "preco" : "1.15", "tipo" : "fruta","distancia": "11km", "quantidade" : "15"},

    ]} 

]

let produtores = {
    "producer111" : {"nome":"Fazenda Santa Horta","distancia": "25km" , "imagemsrc" : "../pictures/farm1.jpg","localizacao" : "Rua João das Regras 202, Aveiro" ,"id": "111", "entrega" : "3.45", "rating": "91%", "arrayOfertas" : [
        {"produto" : "Milho" , "ImagemSrc" : "../pictures/corn.jpg", "id" : "65", "productorID" : "111", "preco" : "2.65", "tipo" : "vegetal","distancia": "25km"},
        {"produto" : "Feijão" , "ImagemSrc" : "../pictures/beans.jpg", "id" : "23", "productorID" : "111", "preco" : "3.65", "tipo" : "semente","distancia": "25km"},
        {"produto" : "limão" , "ImagemSrc" : "../pictures/lime.jpg", "id" : "23", "productorID" : "111", "preco" : "3.05", "tipo" : "fruta","distancia": "25km"},
        {"produto" : "pimentão" , "ImagemSrc" : "../pictures/redpepper.jpg", "id" : "23", "productorID" : "111", "preco" : "1.20", "tipo" : "fruta","distancia": "25km"},


    ]},

    "producer222" : {"nome":"Fazenta Domingos","distancia": "32km" , "imagemsrc" : "../pictures/farm2.jpg", "localizacao" : "Avenida Andre Bastos 190, Aveiro" , "id": "222", "entrega" : "5.55", "rating": "88%", "arrayOfertas" : [
        {"produto" : "Cenoura" , "ImagemSrc" : "../pictures/carrot.jpg", "id" : "34", "productorID" : "222", "preco" : "3.85", "tipo" : "raiz","distancia": "32km"},
        {"produto" : "Arroz" , "ImagemSrc" : "../pictures/rice.jpg", "id" : "11", "productorID" : "222", "preco" : "4.55", "tipo" : "semente","distancia": "32km"},
        {"produto" : "abacaxi" , "ImagemSrc" : "../pictures/pineapple.jpg", "id" : "11", "productorID" : "222", "preco" : "5.55", "tipo" : "fruta","distancia": "32km"},
        {"produto" : "Abóbora" , "ImagemSrc" : "../pictures/pump.jpg", "id" : "11", "productorID" : "222", "preco" : "6.30", "tipo" : "fruta","distancia": "32km"},

    ]},

    "producer333" : {"nome":"Quinta do Edu","distancia": "11km" ,  "imagemsrc" : "../pictures/farm3.jpg","localizacao" : "Estrada nova terra 91, Aveiro" ,"id": "333", "entrega" : "6.75", "rating": "71%", "arrayOfertas" : [

        {"produto" : "Alface" , "ImagemSrc" : "../pictures/lettuce.jpg", "id" : "39", "productorID" : "333", "preco" : "4.75", "tipo" : "vegetal","distancia": "11km"},
        {"produto" : "Morango" , "ImagemSrc" : "../pictures/morango.jpg", "id" : "90", "productorID" : "333", "preco" : "8.95", "tipo" : "fruta","distancia": "11km"},
        {"produto" : "Laranja" , "ImagemSrc" : "../pictures/orange.jpg", "id" : "90", "productorID" : "333", "preco" : "3.15", "tipo" : "fruta","distancia": "11km"},
        {"produto" : "cogumelo portobelo" , "ImagemSrc" : "../pictures/mushroom.jpg", "id" : "90", "productorID" : "333", "preco" : "2.85", "tipo" : "cogumelo","distancia": "11km"}

    ]},

    "producer444" : {"nome":"Fazenda Estrada Nova",  "imagemsrc" : "../pictures/farm4.jpg","localizacao" : "Rua São José 204, Aveiro" ,"id": "444", "entrega" : "6.45", "rating": "95%", "distancia": "18km", "arrayOfertas" : [

        {"produto" : "Couve" , "ImagemSrc" : "../pictures/couve.jpg", "id" : "41", "productorID" : "444", "preco" : "4.20", "tipo" : "vegetal", "distancia": "18km"},
        {"produto" : "Espinafre" , "ImagemSrc" : "../pictures/espinafre.jpg", "id" : "41", "productorID" : "444", "preco" : "4.80", "tipo" : "vegetal", "distancia": "18km"},
        {"produto" : "cebola" , "ImagemSrc" : "../pictures/cebola.jpg", "id" : "41", "productorID" : "444", "preco" : "2.30", "tipo" : "legume", "distancia": "18km"},
        {"produto" : "pimento" , "ImagemSrc" : "../pictures/pimento.jpg", "id" : "41", "productorID" : "444", "preco" : "4.30", "tipo" : "legume", "distancia": "18km"}

    ]},

    "producer555" : {"nome":"Fazenda Terra Fresca",  "imagemsrc" : "../pictures/farm5.jpg","localizacao" : "Rua Clementin 66, Aveiro" ,"id": "555", "entrega" : "7.00", "rating": "89%", "distancia": "9km", "arrayOfertas" : [

        {"produto" : "Castanha" , "ImagemSrc" : "../pictures/castanha.jpg", "id" : "58", "productorID" : "555", "preco" : "5.00", "tipo" : "castanhas", "distancia": "9km"},
        {"produto" : "Cenoura" , "ImagemSrc" : "../pictures/cenoura2.jpg", "id" : "58", "productorID" : "555", "preco" : "3.90", "tipo" : "raizes", "distancia": "9km"},
        {"produto" : "Beterraba" , "ImagemSrc" : "../pictures/beterraba.jpg", "id" : "58", "productorID" : "555", "preco" : "3.20", "tipo" : "legume", "distancia": "9km"},
        {"produto" : "Tomate" , "ImagemSrc" : "../pictures/tomate.jpg", "id" : "58", "productorID" : "555", "preco" : "3.45", "tipo" : "fruta", "distancia": "9km"}

    ]}

    

    

    
    }


$(document).ready(function(){

    let produtosMarketPlace = JSON.stringify(produtos)
    localStorage.setItem('produtos', produtosMarketPlace)

    let produtoresMarketPlace = JSON.stringify(produtores)
    localStorage.setItem('produtores', produtoresMarketPlace);

    let OpçõesCabazesMarketPlace = JSON.stringify(opcoesAssinaturas)
    localStorage.setItem('OptAssinaturas', OpçõesCabazesMarketPlace);
});

