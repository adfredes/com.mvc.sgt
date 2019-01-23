(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('searchPacienteController', ['crudService', searchPacienteController]);

    sgtApp.component('searchPaciente', {
        templateUrl: Domain + '/Paciente/QuickSearch',
        controller: 'searchPacienteController'
    });

    function searchPacienteController(crudService) {
        var vm = this;
        vm.searchText = '';
        vm.select = {};

        vm.search = function () {

            let _url = 'Paciente/Listar/Name/' + vm.searchText;

            var promesa = crudService.GetPHttp(_url);
            return promesa;

            //Paciente/Listar/Name/
        }

        vm.UpdateDate = function () {
            vm.Paciente.FechaNacimiento = moment(vm.Paciente.FechaNacimiento).toDate();            
        }

    }

})();