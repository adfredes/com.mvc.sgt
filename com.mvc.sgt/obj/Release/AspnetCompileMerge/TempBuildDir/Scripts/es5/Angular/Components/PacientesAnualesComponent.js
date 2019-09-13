(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('pacientesAnuales', {
        templateUrl: Domain + 'Paciente/PacientesAnualesAviso',
        controller: ['crudService', '$interval', pacientesAnualesController]
    });
    function pacientesAnualesController(crudService, $interval) {
        var vm = this;
        var stopInterval;
        vm.Pacientes = [];
        vm.$onInit = function () {
            vm.Pacientes = [];
            getData();
            stopInterval = $interval(getData, 500000);
        };
        var getData = function () {
            var promise = crudService.GetPHttp("Paciente/Anual/Sesiones");
            promise.then(function (data) {
                vm.Pacientes = data;
            })
                .catch(function (error) { return vm.Pacientes = {}; });
        };
    }
})();
//# sourceMappingURL=PacientesAnualesComponent.js.map