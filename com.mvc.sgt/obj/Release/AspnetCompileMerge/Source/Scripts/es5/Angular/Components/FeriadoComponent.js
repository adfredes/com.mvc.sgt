(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('feriadoEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditFeriado',
        controller: ['crudService', 'messageService', '$element', feriadoEditController],
        bindings: {
            feriado: "<",
            onSave: "&?"
        }
    });
    function feriadoEditController(crudService, messageService, $element) {
        var vm = this;
        vm.error = "";
        var fecha;
        vm.save = function (data) {
            existenSesiones();
        };
        var CreateOrUpdate = function (data) {
            var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', data);
            promise.then(function (datos) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                $('#CreateOrUpdateFeriado').modal('hide');
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
        vm.$onChanges = function (change) {
            fecha = moment(vm.feriado.Fecha).toDate();
            vm.feriado.Fecha = moment(vm.feriado.Fecha).toDate();
        };
        var existenSesiones = function () {
            crudService.GetPHttp("api/grilla/existesesiones/desde/" + vm.feriado.Fecha.getDate() + "/" + (vm.feriado.Fecha.getMonth() + 1) + "/" + vm.feriado.Fecha.getFullYear() + "/hasta/" + vm.feriado.Fecha.getDate() + "/" + (vm.feriado.Fecha.getMonth() + 1) + "/" + vm.feriado.Fecha.getFullYear())
                .then(function (data) {
                if (data) {
                    messageService.Notify('Feriados', 'Existen sesiones asignadas en el feriado.', $element)
                        .then(function () { return vm.feriado.Fecha = fecha; });
                }
                else {
                    CreateOrUpdate(vm.feriado);
                }
            });
        };
    }
})();
//# sourceMappingURL=FeriadoComponent.js.map