(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('sesionPosponer', {
        templateUrl: Domain + 'Sesion/Posponer',
        controller: ['messageService', 'turnoService', 'eventService', '$mdDialog', '$element', sesionPosponerController],
        bindings: {
            turno: "<?",
            onSave: "&?",
            onCancel: "&?"
        }
    });
    function sesionPosponerController(messageService, turnoService, eventService, $mdDialog, $element) {
        var vm = this;
        vm.sesiones = [];
        vm.minDate = new Date();
        selectedDate = new Date();
        vm.saving = false;
        vm.$onChanges = function (changes) {
            change();
        };
        change = function () {
            vm.saving = false;
            vm.motivo = 9;
            var firstTurno = vm.turno.Sesions.filter(function (x) { return x.Estado == 2
                || x.Estado == 1 || x.Estado == 4 || x.Estado == 5 || x.Estado == 8
                || x.Estado == 7; }).pop();
            vm.sesiones = vm.turno.Sesions.filter(function (x) { return x.selected; });
            vm.minDate = new Date(firstTurno.FechaHora);
            vm.selectedDate = new Date(firstTurno.FechaHora);
            vm.minDate.setDate(vm.minDate.getDate() + 1);
            vm.selectedDate.setDate(vm.selectedDate.getDate() + 1);
        };
        vm.save = function () {
            if (!vm.saving) {
                vm.saving = true;
                vm.sesiones.forEach(function (s) { return s.Estado = vm.motivo; });
                turnoService.posponerSesiones(vm.sesiones, vm.selectedDate)
                    .then(function (data) {
                    vm.saving = false;
                    if (vm.onSave) {
                        vm.onSave()();
                    }
                })
                    .catch(function (data) {
                    vm.saving = false;
                    var promise = messageService.Notify('Posponer', "Se produjo un error: " + data.data, $element);
                    promise.then(function () {
                        if (vm.onSave) {
                            vm.onSave()();
                        }
                    });
                });
            }
        };
        vm.close = function () {
            if (vm.onCancel) {
                vm.onCancel()();
            }
        };
    }
})();
//# sourceMappingURL=SesionPosponerComponent.js.map