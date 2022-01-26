var vm = function(){
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
    self.userExists=ko.observable(false)
    self.incdata=ko.observable(false)
    self.valmail1=ko.observable(false)
    self.campos=ko.observable(false)
    self.endereco=ko.observable('')
    self.pass=ko.observable('')

    /* LOGIN */
    self.login=function(){
        self.endereco($("#exampleInputEmail1").val())
        self.pass($("#exampleInputPassword1").val())
        console.log("Login")
        if (self.endereco()=="" || self.pass()==""){
            console.log("Preencher todos os campos")
            self.userExists(false)
            self.incdata(false)
            self.valmail1(false)
            self.campos(true)
            return
        } 
        if ((self.endereco().includes("@"))==false || (self.endereco().includes("."))==false){
            console.log("E-mail inválido")
            self.userExists(false)
            self.incdata(false)
            self.valmail1(true)
            self.campos(false)
            return
        } 
        if(self.person()=="Cliente"){
            for (ele of clientes){
                if (self.endereco()!=ele.mail){
                    self.userExists(true)
                    self.incdata(false)
                    self.valmail1(false)
                    self.campos(false)
                    return
                }
                if (self.pass()!=ele.password){
                    console.log("Passe Cliente incorreta")
                    self.userExists(false)
                    self.incdata(true)
                    self.valmail1(false)
                    self.campos(false)
                    return
                }
                console.log("redirecting client")
                window.location.href="home_cliente.html"
                localStorage.setItem("cliente",ele.nome)
            }
        }
        else{
            for (ele of fornecedores){
                if (self.endereco()!=ele.mail){
                    self.userExists(true)
                    self.incdata(false)
                    self.valmail1(false)
                    self.campos(false)
                    return
                }
                if(self.pass()!=ele.password){
                    self.userExists(false)
                    self.incdata(true)
                    self.valmail1(false)
                    self.campos(false)
                    return
                }
                console.log("redirecting fornecedor")
                window.location.href="home_fornecedor.html"
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
        self.exist(false)
        self.bola(false)
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
        if ($("#p3").val()==$("#p4").val() & $("#p3").val()!="" & $("#Email2").val().includes("@")==true){
            clientes[$("#Email2").val()]=$("#p3").val()
            window.location.href="home_cliente.html"
        }else{
            self.all(true)
        }
    }
    
};
$(document).ready(function () {
    ko.applyBindings(new vm());
        
});