(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.component("turnosSinFecha", {
        templateUrl: Domain + 'Turno/SinFechaAsignada',
        controller: ['turnoService', 'eventService', '$interval', turnoSinFechaController]        
    });

    function turnoSinFechaController(turnoService, eventService, $interval) {
        let vm = this;
        let stopInterval;

        vm.selectedTurno = {};

        vm.$onInit = () => {
            vm.selectedTurno.ID = 0;
            vm.Turnos = {};
            getData();
            stopInterval = $interval(getData, 500000);
        };

        let getData = () => {            
            let promise = turnoService.getTurnosSinFechaAsignada();
            promise.then(data => {                                
                vm.Turnos = data;
            })
                .catch(error => vm.Turnos = {});
        };

        vm.changeTurno = () => getData();

        vm.verTurno = (turno) => {
            vm.selectedTurno = {ID: turno.ID};                      
            $("#divTurnoSinFecha").modal("show");            
        };        
    }

})();