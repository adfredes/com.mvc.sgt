(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('agendaController', ['crudService', agendaController]);
   
    function agendaController (crudService) {
        var vm = this;                
        vm.feriado = {};

        vm.init = () => {
            vm.feriados = [];
            vm.agenda = {};
            vm.recesos = [];
            vm.bloqueos = [];
            vm.GetFeriados();
            vm.getDias();
            GetAgenda();
            vm.GetRecesos();
            vm.GetBloqueos();
        };

        vm.getDias = () =>
            vm.dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];        

        vm.GetFeriados = function () {
            let _url = 'Agenda/Feriados/Listar';
            crudService.GetPHttp(_url)
                .then(data => vm.feriados = data)
                .catch(err => vm.feriados = []);

        };

        let GetAgenda = () => {
            let _url = 'Agenda/JSON';
            crudService.GetPHttp(_url)
                .then(data => vm.agenda = JSON.parse(data))
                .catch(err => vm.agenda = {});
        };
        
        vm.GetBloqueos = () => {
            let _url = 'Agenda/Bloqueos';
            crudService.GetPHttp(_url)
                .then(data => vm.bloqueos = JSON.parse(data))
                .catch(err => vm.bloqueos = {});
        };

        vm.GetRecesos = () => {
            let _url = 'Agenda/Receso';
            crudService.GetPHttp(_url)
                .then(data => vm.recesos = JSON.parse(data))
                .catch(err => vm.recesos = {});
        };

        vm.EditFeriado = function (feriado) {
            feriado.Fecha = moment(feriado.Fecha).toDate();
            vm.feriado = feriado;
        };

        vm.CreateFeriado = function (feriado) {
            vm.feriado = {};
        };

    }

})();