(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('agendaController', ['crudService', 'messageService', '$element', agendaController]);
    function agendaController(crudService, messageService, $element) {
        var vm = this;
        vm.feriado = {};
        vm.receso = {};
        vm.bloqueo = {};
        vm.init = function () {
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
        vm.getDias = function () {
            return vm.dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
        };
        vm.GetAusencias = function () {
            var _url = 'Profesional/Ausencias';
            crudService.GetPHttp(_url)
                .then(function (data) { return vm.ausencias = JSON.parse(data); })
                .catch(function (err) { return vm.ausencias = []; });
        };
        vm.GetFeriados = function () {
            var _url = 'Agenda/Feriados/Listar';
            crudService.GetPHttp(_url)
                .then(function (data) { return vm.feriados = data; })
                .catch(function (err) { return vm.feriados = []; });
        };
        var GetAgenda = function () {
            var _url = 'Agenda/JSON';
            crudService.GetPHttp(_url)
                .then(function (data) {
                vm.agenda = JSON.parse(data);
                vm.agenda.HoraDesde = moment(vm.agenda.HoraDesde).toDate();
                vm.agenda.HoraHasta = moment(vm.agenda.HoraHasta).toDate();
            })
                .catch(function (err) { return vm.agenda = {}; });
        };
        vm.GetBloqueos = function () {
            var _url = 'Agenda/Bloqueos';
            crudService.GetPHttp(_url)
                .then(function (data) {
                vm.bloqueos = JSON.parse(data);
            })
                .catch(function (err) { return vm.bloqueos = {}; });
        };
        vm.GetRecesos = function () {
            var _url = 'Agenda/Receso';
            crudService.GetPHttp(_url)
                .then(function (data) { return vm.recesos = JSON.parse(data); })
                .catch(function (err) { return vm.recesos = {}; });
        };
        vm.EditFeriado = function (feriado) {
            feriado.Fecha = moment(feriado.Fecha).toDate();
            var nferiado = JSON.parse(JSON.stringify(feriado));
            vm.feriado = nferiado;
        };
        vm.DeleteFeriado = function (feriado) {
            messageService.showConfirm('Feriados', 'Esta seguro que desea eliminar el feriado?', 'Aceptar', 'Cancelar', $element)
                .then(function () {
                feriado.Habilitado = false;
                feriado.Fecha = moment(feriado.Fecha).toDate();
                var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', feriado);
                promise.then(function (data) { return vm.GetFeriados(); });
            });
        };
        vm.CreateFeriado = function (feriado) {
            vm.feriado = {};
        };
        vm.EditAusencia = function (ausencia) {
            vm.ausencia = ausencia;
        };
        vm.DeleteAusencia = function (ausencia) {
            messageService.showConfirm('Ausencias', 'Esta seguro que desea eliminar el registro?', 'Aceptar', 'Cancelar', $element)
                .then(function () {
                ausencia.Habilitado = false;
                var promise = crudService.PostHttp('/Profesional/Ausencias/CreateOrEdit', ausencia);
                promise.then(function (data) { return vm.GetAusencias(); });
            });
        };
        vm.CreateAusencia = function (ausencia) {
            vm.ausencia = {
                Habilitado: true,
                FechaDesde: new Date()
            };
        };
        vm.EditReceso = function (receso) {
            var nreceso = JSON.parse(JSON.stringify(receso));
            vm.receso = nreceso;
        };
        vm.DeleteReceso = function (receso) {
            messageService.showConfirm('Recesos', 'Esta seguro que desea eliminar el receso?', 'Aceptar', 'Cancelar', $element)
                .then(function () {
                receso.Habilitado = false;
                var promise = crudService.PostHttp('/Agenda/CreateOrEditReceso', receso);
                promise.then(function (data) { return vm.GetRecesos(); });
            });
        };
        vm.CreateReceso = function (feriado) {
            vm.receso = {};
        };
        vm.EditBloqueo = function (bloqueo) {
            var nbloqueo = JSON.parse(JSON.stringify(bloqueo));
            nbloqueo.HoraDesde = moment(bloqueo.HoraDesde).toDate();
            nbloqueo.HoraHasta = moment(bloqueo.HoraHasta).toDate();
            nbloqueo.FechaDesde = moment(bloqueo.FechaDesde).toDate();
            nbloqueo.FechaHasta = moment(bloqueo.FechaHasta).toDate();
            vm.bloqueo = nbloqueo;
        };
        vm.DeleteBloqueo = function (bloqueo) {
            messageService.showConfirm('Bloqueos', 'Esta seguro que desea eliminar el bloqueo?', 'Aceptar', 'Cancelar', $element)
                .then(function () {
                bloqueo.Habilitado = false;
                var promise = crudService.PostHttp('/Agenda/CreateOrEditBloqueo', bloqueo);
                promise.then(function (data) { return vm.GetBloqueos(); });
            });
        };
        vm.CreateBloqueo = function () { return vm.bloqueo = {}; };
        vm.saveAgenda = function (agenda) { return vm.agenda = agenda; };
    }
})();
//# sourceMappingURL=AgendaController.js.map