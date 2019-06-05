(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('sesionPosponer', {
        templateUrl: Domain + 'Sesion/Posponer',
        controller: ['turnoService', 'eventService', '$mdDialog', sesionPosponerController],
        bindings: {
            turno: "<?",
            onSave: "&?",
            onCancel: "&?"
        }
    });
    function sesionPosponerController(turnoService, eventService, $mdDialog) {
        var vm = this;
        vm.sesiones = [];
        vm.minDate = new Date();
        selectedDate = new Date();
        vm.$onChanges = function (changes) {
            change();
        };
        change = function () {
            vm.motivo = 9;
            var firstTurno = vm.turno.Sesions.filter(function (x) { return x.Estado == 2
                || x.Estado == 1 || x.Estado == 4 || x.Estado == 5 || x.Estado == 8
                || x.Estado == 7; })[0];
            vm.sesiones = vm.turno.Sesions.filter(function (x) { return x.selected; });
            ;
            vm.minDate = new Date(firstTurno.FechaHora);
            vm.selectedDate = new Date(firstTurno.FechaHora);
            vm.minDate.setDate(vm.minDate.getDate() + 1);
            vm.selectedDate.setDate(vm.selectedDate.getDate() + 1);
        };
        vm.save = function () {
            vm.sesiones.forEach(function (s) { return s.Estado = vm.motivo; });
            turnoService.posponerSesiones(vm.sesiones, vm.selectedDate)
                .then(function (data) {
                if (vm.onSave) {
                    vm.onSave()();
                }
            })
                .catch(function (data) { return undefined; });
        };
        vm.close = function () {
            if (vm.onCancel) {
                vm.onCancel()();
            }
        };
    }
})();
//# sourceMappingURL=SesionPosponerComponent.js.map