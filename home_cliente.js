$(document).ready(function(){
    $("input[value='MbWay']").prop("checked",true)
    $("img[src='MBWAY.jpg']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
    $("#userX").text(localStorage.getItem("cliente"))
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
    }).on('click', showlocation).on("click",changecolor).on("click",link).addTo(map);
    var circle2=L.circle([40.4005,-7.53965], {
        color: 'white',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 10000
    }).on('click', showlocation).on("click",changecolor).on("click",link).addTo(map);
    
    function showlocation(e){
        if (map.getZoom()!=10){
            var coord= e.latlng;
            map.setView(coord,10)
        }
    }

    function link(){
        var temp2 = setInterval(function(){
            localStorage.setItem("pagamento",$("input[type='radio']:checked").val())
            window.location.href="marketplace.html"
        },2500)
    }

    console.log(circle2.options.fillColor)
    function changecolor(){
        if (circle2.options.fillColor=="#f03"){
            circle2.setStyle({fillColor:"#006400"})
            circle1.setStyle({fillColor:"#f03"})
        }else{
            circle1.setStyle({fillColor:"#006400"})
            circle2.setStyle({fillColor:"#f03"})
        }
    }
    map.on('zoomend', function(e) {
        if (map.getZoom()==6.7) map.dragging.disable()
        else map.dragging.enable()
    });
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
    $("#cabaz").click(function(){
        window.location.href="cabaz.html"
    })
    $("#pagamento").click(function(){
        // window.location.href="pagamento.html"
        $("#offcanvasRight").offcanvas('show')
    })
    $("#dados").click(function(){
        window.location.href="dados.html"
    })
    $("#logout").click(function(){
        window.location.href="index.html"
    })
    $("form").change(function(){
        if ($("input[type='radio']:checked").val()=="MbWay"){
            $("img[src='MBWAY.jpg']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
        }else $("img[src='MBWAY.jpg']").css('background-image','none')
        if ($("input[type='radio']:checked").val()=="PayPal"){
            $("img[src='paypal.png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF)')
        }else $("img[src='paypal.png']").css('background-image','none')
        if ($("input[type='radio']:checked").val()=="Multibanco"){
            $("img[src='multibancoooo.png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF) ')
        }else $("img[src='multibancoooo.png']").css('background-image','none')
        if ($("input[type='radio']:checked").val()=="Dinheiro"){
            $("img[src='pictures/cash.png']").css('background-image','linear-gradient(to right, #2E3192  , #1BFFFF) ')
        }else $("img[src='pictures/cash.png']").css('background-image','none')
        
    })

})
