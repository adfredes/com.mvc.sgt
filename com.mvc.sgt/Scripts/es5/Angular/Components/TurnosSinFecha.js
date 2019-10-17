(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component("turnosSinFecha", {
        templateUrl: Domain + 'Turno/SinFechaAsignada',
        controller: ['turnoService', 'eventService', '$interval', '$window', turnoSinFechaController]
    });
    function turnoSinFechaController(turnoService, eventService, $interval, $window) {
        var vm = this;
        var stopInterval;
        vm.selectedTurno = {};
        vm.$onInit = function () {
            vm.selectedTurno.ID = 0;
            vm.Turnos = {};
            getData();
            stopInterval = $interval(getData, 500000);
            $window.addEventListener('UpdateTurnos', getData);
        };
        var getData = function () {
            var promise = turnoService.getTurnosSinFechaAsignada();
            promise.then(function (data) {
                vm.Turnos = data;
            })
                .catch(function (error) { return vm.Turnos = {}; });
        };
        vm.changeTurno = function () { return getData(); };
        vm.verTurno = function (turno) {
            vm.selectedTurno = { ID: turno.ID };
            $("#divTurnoSinFecha").modal("show");
        };
    }
})();
//# sourceMappingURL=TurnosSinFecha.js.map