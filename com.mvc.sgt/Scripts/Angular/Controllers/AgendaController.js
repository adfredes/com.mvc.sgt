(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('agendaController', ['crudService', 'messageService', '$element', agendaController]);
   
    function agendaController(crudService, messageService, $element) {
        var vm = this;                
        vm.feriado = {};
        vm.receso = {};
        vm.bloqueo = {};

        vm.init = () => {
            vm.ausenciaSuplencia = {};
            vm.feriados = [];
            vm.agenda = {};
            vm.recesos = [];
            vm.bloqueos = [];
            vm.ausencias = [];
            vm.GetFeriados();
            vm.getDias();
            GetAgenda();
            vm.GetRecesos();
            vm.GetBloqueos();
            vm.GetAusencias();
        };

        vm.getDias = () =>
            vm.dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];        


        vm.GetAusencias = () => {
            let _url = 'Profesional/Ausencias';
            crudService.GetPHttp(_url)
                .then(data => vm.ausencias = JSON.parse(data))
                .catch(err => vm.ausencias = []);
        };

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
                .then(data => {
                vm.bloqueos = JSON.parse(data);
                
                })
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
            messageService.showConfirm('Feriados', 'Esta seguro que desea eliminar el feriado?', 'Aceptar', 'Cancelar', $element)
                .then(() => {
                    feriado.Habilitado = false;
                    feriado.Fecha = moment(feriado.Fecha).toDate();
                    var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', feriado);
                    promise.then(data => vm.GetFeriados());
                });            
        };

        vm.CreateFeriado = function (feriado) {
            vm.feriado = {};
        };

        vm.EditAusencia = function (ausencia) {            
            vm.ausencia = ausencia;
        };

        vm.DeleteAusencia = (ausencia) => {
            messageService.showConfirm('Ausencias', 'Esta seguro que desea eliminar el registro?', 'Aceptar', 'Cancelar', $element)
                .then(() => {
                    ausencia.Habilitado = false;                    
                    var promise = crudService.PostHttp('/Profesional/Ausencias/CreateOrEdit', ausencia);
                    promise.then(data => vm.GetAusencias());
                });
        };

        vm.CreateAusencia = function (ausencia) {
            vm.ausencia = {
                Habilitado: true,
                FechaDesde: new Date()
            };
        };

        vm.CreateSuplencia = (ausencia) => {         
            vm.ausenciaSuplencia = ausencia;
        };

        vm.EditReceso = function (receso) {            
            let nreceso = JSON.parse(JSON.stringify(receso));
            vm.receso = nreceso;
        };

        vm.DeleteReceso = receso => {
            messageService.showConfirm('Recesos', 'Esta seguro que desea eliminar el receso?', 'Aceptar', 'Cancelar', $element)
                .then(() => {
                    receso.Habilitado = false;
                    var promise = crudService.PostHttp('/Agenda/CreateOrEditReceso', receso);
                    promise.then(data => vm.GetRecesos());            
                });                        
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
            messageService.showConfirm('Bloqueos', 'Esta seguro que desea eliminar el bloqueo?', 'Aceptar', 'Cancelar', $element)
                .then(() => {
                    bloqueo.Habilitado = false;
                    var promise = crudService.PostHttp('/Agenda/CreateOrEditBloqueo', bloqueo);
                    promise.then(data => vm.GetBloqueos());
                });
        };

        vm.CreateBloqueo = () => vm.bloqueo = {};
        

        vm.saveAgenda = agenda => vm.agenda = agenda;
        

    }

})();