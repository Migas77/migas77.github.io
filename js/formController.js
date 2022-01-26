let state = true
let emailElements = ['@', '.', '.com']
function formCheck(){
/*
    let frsName =  toString(document.getElementById('formFirstName').value)
    let lastName = toString(document.getElementById('formLastName').value)
    let email = toString(document.getElementById('formEmail').value)
    let nif = toString(document.getElementById('formNIF').value)
*/
    let frsName = $('#formFirstName').val()

    frsName = frsName.split(' ')

    lf =  frsName.length()


    return (lf)

    
    
   
    
}

$('#submitform').click(function(){
    alert(formCheck())
})
