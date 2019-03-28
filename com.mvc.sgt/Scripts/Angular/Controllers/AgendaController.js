(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('agendaController', ['crudService', agendaController]);
   
    function agendaController (crudService) {
        var vm = this;                
        vm.feriado = {};
        vm.receso = {};
        vm.bloqueo = {};

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
                .then(data => {
                vm.agenda = JSON.parse(data);
                vm.agenda.HoraDesde = moment(vm.agenda.HoraDesde).toDate();
                vm.agenda.HoraHasta = moment(vm.agenda.HoraHasta).toDate();
                })
                .catch(err => vm.agenda = {});
        };
        
        vm.GetBloqueos = () => {
            let _url = 'Agenda/Bloqueos';
            crudService.GetPHttp(_url)
                .then(data => { vm.bloqueos = JSON.parse(data)})
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
            let nferiado = JSON.parse(JSON.stringify(feriado));
            vm.feriado = nferiado;
        };

        vm.DeleteFeriado = (feriado) => {
            feriado.Habilitado = false;
            var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', feriado);
            promise.then(data => vm.GetFeriados());                                
        };

        vm.CreateFeriado = function (feriado) {
            vm.feriado = {};
        };

        vm.EditReceso = function (receso) {            
            let nreceso = JSON.parse(JSON.stringify(receso));
            vm.receso = nreceso;
        };

        vm.DeleteReceso = receso => {
            receso.Habilitado = false;
            var promise = crudService.PostHttp('/Agenda/CreateOrEditReceso', receso);
            promise.then(data => vm.GetRecesos());            
        };

        vm.CreateReceso = function (feriado) {
            vm.receso = {};
        };

        vm.EditBloqueo = bloqueo => {        
            let nbloqueo = JSON.parse(JSON.stringify(bloqueo));
            nbloqueo.HoraDesde = moment(bloqueo.HoraDesde).toDate();
            nbloqueo.HoraHasta = moment(bloqueo.HoraHasta).toDate();
            nbloqueo.FechaDesde = moment(bloqueo.FechaDesde).toDate();
            nbloqueo.FechaHasta = moment(bloqueo.FechaHasta).toDate();            
            vm.bloqueo = nbloqueo;
        };
        

        vm.DeleteBloqueo = bloqueo => {
            bloqueo.Habilitado = false;
            var promise = crudService.PostHttp('/Agenda/CreateOrEditBloqueo', bloqueo);
            promise.then(data => vm.GetBloqueos());            
        };

        vm.CreateBloqueo = () => vm.bloqueo = {};
        

        vm.saveAgenda = agenda => vm.agenda = agenda;
        

    }

})();