(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.component('sesionPosponer', {
        templateUrl: Domain + 'Sesion/Posponer',
        controller: ['turnoService', 'eventService', '$mdDialog',sesionPosponerController],
        bindings: {
            turno: "<?",
            onSave: "&?",
            onCancel: "&?"
        }
    });

    function sesionPosponerController(turnoService, eventService, $mdDialog) {
        let vm = this;
        vm.sesiones = [];
        vm.minDate = new Date();
        selectedDate = new Date();

        
        vm.$onChanges = (changes) => {
            change();
        };

        change = () => {            
            vm.motivo = 9;
            let firstTurno = vm.turno.Sesions.filter(x => x.Estado == 2
                || x.Estado == 1 || x.Estado == 4 || x.Estado == 5 || x.Estado == 8
                || x.Estado == 7
            )[0];
            vm.sesiones = vm.turno.Sesions.filter(x => x.selected);            ;
            vm.minDate = new Date(firstTurno.FechaHora);            
            vm.selectedDate = new Date(firstTurno.FechaHora);
            vm.minDate.setDate(vm.minDate.getDate() + 1);
            vm.selectedDate.setDate(vm.selectedDate.getDate() + 1);
        };

        vm.save = () => {
            vm.sesiones.forEach(s => s.Estado = vm.motivo);
            turnoService.posponerSesiones(vm.sesiones, vm.selectedDate)
                .then((data) => {
                    if (vm.onSave) {
                        vm.onSave()();
                    }
                }
                )
                .catch((data) => undefined);
            
        };

        vm.close = () => {
            if (vm.onCancel) {
                vm.onCancel()();
            }
        };

    }


})();