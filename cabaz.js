var vm = function(){
    var self=this;
    self.cabaz=ko.observableArray([
        {produtos:["abobora","cenoura","curgete"],pagamento:"PayPal"},
        {produtos:["abobora","cenoura","curgete","uvas"],pagamento:"MbWay"},
        {produtos:["uvas"], pagamento:"Multibanco"}
    ])
    
}
$(document).ready(function () {
    ko.applyBindings(new vm());
    var popoverTriggerList = [].slice.call($('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
});

