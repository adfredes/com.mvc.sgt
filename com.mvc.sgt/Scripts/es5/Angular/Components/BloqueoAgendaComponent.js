(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('bloqueoAgendaEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditBloqueo',
        controller: ['crudService', bloqueoAgendaEditController],
        bindings: {
            bloqueo: "<",
            onSave: "&?"
        }
    });
    function bloqueoAgendaEditController(crudService) {
        var vm = this;
        vm.error = "";
        vm.consultorios = [];
        vm.TurnosSimultaneo = [];
        vm.$onChanges = function (change) {
            vm.changeConsultorio();
        };
        vm.$onInit = function () { return getConsultorios(); };
        vm.changeConsultorio = function () {
            consultorio = vm.consultorios.find(function (c) { return c.ID == vm.bloqueo.ConsultorioId; });
            vm.TurnosSimultaneo = [];
            if (consultorio && consultorio.TurnosSimultaneos > 1) {
                for (x = 1; x <= consultorio.TurnosSimultaneos; x++) {
                    vm.TurnosSimultaneo.push(x);
                }
            }
        };
        vm.changeTodoElDia = function () {
            if (vm.bloqueo.TodoElDia) {
                var today = new Date();
                today = new Date(today.setSeconds(0));
                today = new Date(today.setMilliseconds(0));
                vm.bloqueo.HoraDesde = new Date(today.setHours(0));
                vm.bloqueo.HoraDesde = new Date(today.setMinutes(0));
                vm.bloqueo.HoraHasta = new Date(today.setHours(23));
                vm.bloqueo.HoraHasta = new Date(today.setMinutes(59));
            }
        };
        vm.save = function (data) {
            var promise = crudService.PostHttp('/Agenda/CreateOrEditBloqueo', data);
            promise.then(function (data) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                $('#CreateOrUpdateBloqueo').modal('hide');
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
        var getConsultorios = function () {
            var promise = crudService.GetPHttp("api/grilla/Consultorios");
            promise.then(function (data) {
                vm.consultorios = data;
                vm.consultorios.unshift({ ID: 0, Descripcion: '[TODOS]' });
            })
                .catch(function (err) { vm.consultorios = []; vm.reading = false; });
        };
    }
})();
//# sourceMappingURL=BloqueoAgendaComponent.js.map