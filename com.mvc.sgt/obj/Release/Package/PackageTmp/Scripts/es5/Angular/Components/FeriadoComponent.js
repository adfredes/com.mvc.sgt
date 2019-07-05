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
        vm.save = function (data) {
            var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', data);
            promise.then(function (data) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                existenSesiones();
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
        vm.$onChanges = function (change) {
            vm.feriado.Fecha = moment(vm.feriado.Fecha).toDate();
        };
        var existenSesiones = function () {
            crudService.GetPHttp("api/grilla/existesesiones/desde/" + vm.feriado.Fecha.getDate() + "/" + (vm.feriado.Fecha.getMonth() + 1) + "/" + vm.feriado.Fecha.getFullYear() + "/hasta/" + vm.feriado.Fecha.getDate() + "/" + (vm.feriado.Fecha.getMonth() + 1) + "/" + vm.feriado.Fecha.getFullYear())
                .then(function (data) {
                if (data) {
                    messageService.Notify('Feriados', 'Existen sesiones asignadas en el feriado.', $element)
                        .then(function () { return $('#CreateOrUpdateFeriado').modal('hide'); });
                }
                else {
                    $('#CreateOrUpdateFeriado').modal('hide');
                }
            });
        };
    }
})();
//# sourceMappingURL=FeriadoComponent.js.map