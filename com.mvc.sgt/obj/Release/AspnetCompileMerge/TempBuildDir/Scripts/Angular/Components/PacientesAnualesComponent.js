(function () {
    var sgtApp = angular.module("sgtApp");


    sgtApp.component('pacientesAnuales', {
        templateUrl: Domain + 'Paciente/PacientesAnualesAviso',       
        controller: ['crudService', '$interval', pacientesAnualesController]
    });

    function pacientesAnualesController(crudService, $interval) {
        let vm = this;
        let stopInterval;
        vm.Pacientes = [];

        vm.$onInit = () => {
            vm.Pacientes = [];
            getData();
            stopInterval = $interval(getData, 500000);
        };

        let getData = () => {
            let promise = crudService.GetPHttp(`Paciente/Anual/Sesiones`);
            promise.then(data => {
                vm.Pacientes = data;
            })
                .catch(error => vm.Pacientes = {});
        };
    }

})();