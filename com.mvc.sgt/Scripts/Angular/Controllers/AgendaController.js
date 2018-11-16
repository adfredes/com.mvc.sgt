(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('agendaController', ['crudService', agendaController]);
   
    function agendaController (crudService) {
        var vm = this;        
        vm.feriado = {};

        vm.GetFeriados = function () {
            let _url = 'Agenda/Feriados/Listar';
            crudService.GetPHttp(_url)
                .then(data => vm.feriados = data)
                .catch(err => vm.feriados = []);
            
        }

        vm.EditFeriado = function (feriado){                                                
            feriado.Fecha = moment(feriado.Fecha).toDate();                       
            vm.feriado = feriado;                     
        }

        vm.CreateFeriado = function (feriado) {
            vm.feriado = {};
        }

    }

})();