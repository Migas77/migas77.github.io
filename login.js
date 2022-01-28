var vm = function(){
    localStorage.setItem("OfertasOnly",false)
    var clientes;
    var fornecedores;
    $.get("https://retoolapi.dev/84bNn4/users",function(data,status){
        clientes=data
        console.log("clientes",clientes)
    })
    $.get("https://retoolapi.dev/wQ6N5S/fornecedores",function(data,status){
        fornecedores=data
        console.log("fornecedores",fornecedores)
    })
    var self=this;
    self.person=ko.observable("Cliente")
    self.updateUser=function(){
        if (self.person()=="Cliente"){
            self.person("Fornecedor")
        }else{
            self.person("Cliente")
        }
        return true
    }

    self.ofertas=function(){
        localStorage.setItem("OfertasOnly",true)
        window.location.href="marketplace.html"

    }

    self.userExists=ko.observable(false)
    self.incdata=ko.observable(false)
    self.valmail1=ko.observable(false)
    self.campos=ko.observable(false)
    self.endereco=ko.observable('')
    self.pass=ko.observable('')

    /* LOGIN */
    self.login=function(){
        self.userExists(false)
        self.incdata(false)
        self.valmail1(false)
        self.campos(false)
        self.endereco($("#exampleInputEmail1").val())
        self.pass($("#exampleInputPassword1").val())
        console.log("Login")
        if (self.endereco()=="" || self.pass()==""){
            console.log("Preencher todos os campos")

            self.campos(true)
            return
        } 
        if ((self.endereco().includes("@"))==false || (self.endereco().includes("."))==false){
            console.log("E-mail inválido")
            self.valmail1(true)
            return
        } 
        if(self.person()=="Cliente"){
            for (ele of clientes){
                self.userExists(false)
                self.incdata(false)
                self.valmail1(false)
                self.campos(false)
                if (self.endereco()==ele.mail){
                    if (self.pass()==ele.password){
                        console.log("redirecting client")
                        window.location.href="home_cliente.html"
                        localStorage.setItem("cliente",ele.nome)
                        localStorage.setItem("pagamento",ele.pagamento)
                        localStorage.setItem("mail",ele.mail)
                        break
                    }else{
                        console.log("Passe Cliente incorreta")
                        self.userExists(false)
                        self.incdata(true)
                        self.valmail1(false)
                        self.campos(false)
                        break
                    }
                }else{
                    if(clientes.indexOf(ele)!=(clientes.length-1)){
                        console.log(clientes.indexOf(ele),clientes.length)
                        continue
                    }else{
                        console.log("last")
                        self.userExists(true)
                        self.incdata(false)
                        self.valmail1(false)
                        self.campos(false)
                    }
                } 
            }
        }
        else{
            for (ele of clientes){
                self.userExists(false)
                self.incdata(false)
                self.valmail1(false)
                self.campos(false)
                if (self.endereco()==ele.mail){
                    if (self.pass()==ele.password){
                        console.log("redirecting client")
                        window.location.href="emDesenvolvimento.html"
                        break
                    }else{
                        console.log("Passe Cliente incorreta")
                        self.userExists(false)
                        self.incdata(true)
                        self.valmail1(false)
                        self.campos(false)
                        break
                    }
                }else{
                    if(clientes.indexOf(ele)!=(clientes.length-1)){
                        console.log(clientes.indexOf(ele),clientes.length)
                        continue
                    }else{
                        console.log("last")
                        self.userExists(true)
                        self.incdata(false)
                        self.valmail1(false)
                        self.campos(false)
                    }
                } 
            }
        }
    }
    /* --FIM-- */

    /* CHANGE PASSWORD */
    self.forgot=function(){
        $("#staticBackdrop").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    self.exist=ko.observable(false)
    self.bola=ko.observable(false)
    self.changePass=function(){
        if ($("#Email").val().trim()=="" || $("#Email").val()==undefined ||$("#p1").val()=="" || $("#p2").val()==""){
            self.bola(true)
            self.exist(false)
            return
        }
        for (ele of clientes){
            if ($("#Email").val().trim()!=ele.mail){
                self.exist(true)
                self.bola(false)
                return
            }
            if ($("#p1").val()!="" & $("#p1").val()==$("#p2").val()){
                $.ajax({
                    type: "PUT",
                    url: "https://retoolapi.dev/84bNn4/users/"+ele.id,
                    data: {
                        "id":ele.id,
                        "mail":ele.mail,
                        "nome":ele.nome,
                        "password":$("#p1").val()
                    },
                    dataType: "json",
                    success: function(data, textStatus, jqXHR) {
                        console.log(data)
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log("Ajax Fail")
                    },
                    beforeSend: function(jqXHR, settings) {
                        console.log("Sending")
                    },
                    complete: function(jqXHR, textStatus) {
                        console.log("COMPLETE")
                    }
                });
            }
        }
        console.log("aqui")
        var timer = setInterval(function(){
            $.get("https://retoolapi.dev/84bNn4/users",function(data,status){
                clientes=data
                console.log("clientes",clientes)
                $("#staticBackdrop").modal('hide')
                self.clear()
                clearInterval(timer)
            })
        },1500)
    }

    self.clear=function(){
        $("#Email").val("")
        $("#p1").val("")
        $("#p2").val("")
        $("#p3").val("")
        $("#p4").val("")
        $("#Email2").val("")
        $("option[value='']").prop("selected",true)
        $("#newClient").val("")
        self.exist(false)
        self.bola(false)
        self.all(false)
    }
    /* --FIM-- */



    self.show=function(){
        $("#rmodal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    
    
    self.all=ko.observable(false)
    self.registo=function(){
        if ($("#p3").val()==$("#p4").val() & $("#p3").val()!="" & $("#Email2").val().includes("@")==true & $("#Email2").val().includes(".")==true & $("select option:selected").val()!=""){
            $('button').last().prop('disabled', true);
            for (ele of clientes){
                if (ele.mail==$("#Email2").val().trim()){
                    alert("Conta Email já utilizada neste site")
                    $('button').last().prop('disabled', false);
                    return
                }
            }
            console.log($("select option:selected").val())
            $.post("https://retoolapi.dev/84bNn4/users",
            {
                "mail":$("#Email2").val(),
                "nome":$("#newClient").val(),
                "password":$("#p3").val(),
                "pagamento":$("select option:selected").val()
            })
            localStorage.setItem("cliente",$("#newClient").val())
            localStorage.setItem("pagamento",$("select option:selected").val())
            localStorage.setItem("mail",$("#Email2").val())
            self.clear()
            temporizador1=setInterval(function(){
                window.location.href="home_cliente.html"
                clearInterval(temporizador1)
            },3000)
        }else{
            self.all(true)
        }
    }
    
};
$(document).ready(function () {
    ko.applyBindings(new vm());
        
});