$(document).ready(function(){
    var pagamento=localStorage.getItem("pagamento")
    $("input[value='"+ pagamento + "']").prop("checked",true)
    if (pagamento=="MbWay") $("img[src='MbWay.jpg']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
    else if (pagamento=="Dinheiro") $("img[src='pictures/Dinheiro.png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
    else $("img[src='" + pagamento + ".png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
    $("#userX").text(localStorage.getItem("cliente"))
    $(".toast-body").html("<b>Nome: </b>" + localStorage.getItem("cliente") + "<br><b>Email: </b>"+ localStorage.getItem("mail") + "<br><b>Método de Pagamento: </b>" + pagamento )
    var map= L.map('map',{zoomSnap: 0.5}).setView([39.5,-8],6.7);
    var bounds = L.latLngBounds([[42, -5.6], [37, -10.5]]);
    map.setMaxBounds(bounds);
    map.dragging.disable()
    // Set up the OSM layer
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: 'Data © <a  href="http://osm.org/copyright">OpenStreetMap</a></div>',
            maxZoom:14,
            minZoom:6.7,
            noWrap:true,
            bounds:bounds,
        }).addTo(map);
    /* L.marker([Lat,Lng],{icon: myIcon}).on("click", showLocation).bindPopup("<a style='text-decoration:none; 'href='" + CircuitId + "'><b>" + Name + "</b></a><br>" + Location + ", "+ Country).addTo(map); */
    var circle1=L.circle([38.571,-7.9096], {
        color: 'white',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 10000
    }).on('click', showlocation).on("click",changecolor1).on("click",link2).addTo(map);
    var circle2=L.circle([40.4005,-7.53965], {
        color: 'white',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 10000
    }).on('click', showlocation).on("click",changecolor2).on("click",link1).addTo(map);
    
    function showlocation(e){
        if (map.getZoom()!=10){
            var coord= e.latlng;
            map.setView(coord,10)
        }
    }

    function link1(){
        var temp2 = setInterval(function(){
            localStorage.setItem("pagamento",$("input[type='radio']:checked").val())
            window.location.href="marketplace.html"
        },2500)
    }

    function link2(){
        var temp5 = setInterval(function(){
            window.location.href="emDesenvolvimento.html"
        },2500)
    }

    function changecolor1(){ circle1.setStyle({fillColor:"#006400"})}
    function changecolor2(){ circle2.setStyle({fillColor:"#006400"})}

    map.on('zoomend', function(e) {
        if (map.getZoom()==6.7) map.dragging.disable()
        else map.dragging.enable()
    });
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
    $("#cabaz").click(function(){
        window.location.href="html/subscriptions.html"
    })
    $("img[src='user_info2.png']").click(function(){
        $("#liveToast").toast("show")
    })
    $("#dados").click(function(){
        $("#liveToast").toast("show")
    })
    $("#pagamento, img[src='pagamentos.png']").click(function(){
        $("#offcanvasRight").offcanvas('show')
    })
    $("#logout").click(function(){
        window.location.href="index.html"
    })
    $("form").change(function(){
        if ($("input[type='radio']:checked").val()=="MbWay"){
            $("img[src='MbWay.jpg']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
        }else $("img[src='MbWay.jpg']").css('background-image','none')
        if ($("input[type='radio']:checked").val()=="PayPal"){
            $("img[src='PayPal.png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
        }else $("img[src='PayPal.png']").css('background-image','none')
        if ($("input[type='radio']:checked").val()=="Multibanco"){
            $("img[src='Multibanco.png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF) ')
        }else $("img[src='Multibanco.png']").css('background-image','none')
        if ($("input[type='radio']:checked").val()=="Dinheiro"){
            $("img[src='pictures/Dinheiro.png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF) ')
        }else $("img[src='pictures/Dinheiro.png']").css('background-image','none')
        
    })

})
