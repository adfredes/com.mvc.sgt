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
        vm.saving = false;

        
        vm.$onChanges = (changes) => {
            change();
        };

        change = () => {            
            vm.saving = false;
            vm.motivo = 9;            
            let firstTurno = vm.turno.Sesions.filter(x => x.Estado == 2
                || x.Estado == 1 || x.Estado == 4 || x.Estado == 5 || x.Estado == 8
                || x.Estado == 7
            ).pop();
            vm.sesiones = vm.turno.Sesions.filter(x => x.selected);            
            vm.minDate = new Date(firstTurno.FechaHora);            
            vm.selectedDate = new Date(firstTurno.FechaHora);
            vm.minDate.setDate(vm.minDate.getDate() + 1);
            vm.selectedDate.setDate(vm.selectedDate.getDate() + 1);
        };

        vm.save = () => {
            if (!vm.saving) {
                vm.saving = true;
            
                vm.sesiones.forEach(s => s.Estado = vm.motivo);
                turnoService.posponerSesiones(vm.sesiones, vm.selectedDate)
                    .then((data) => {
                        vm.saving = false;
                        if (vm.onSave) {
                            vm.onSave()();
                        }
                    }
                    )
                    .catch((data) => vm.saving = false);
            }
        };

        vm.close = () => {
            if (vm.onCancel) {
                vm.onCancel()();
            }
        };

    }


})();