(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('searchPacienteController', ['crudService', searchPacienteController]);

    sgtApp.component('searchPaciente', {        
        templateUrl: Domain + '/Paciente/QuickSearch',
        controller: 'searchPacienteController',
        bindings: {
            addEnabled: "@?",
            viewEnabled: "@?"
        }
    });

    function searchPacienteController(crudService) {
        var vm = this;
        
        vm.$onInit = () => {
            vm.searchText = '';
            vm.select = {};
            vm.addEnabled = vm.addEnabled ? true : false;
            vm.viewEnabled = vm.viewEnabled ? true : false;
        };

        vm.search = function () {

            let _url = 'Paciente/Listar/Name/' + vm.searchText;

            var promesa = crudService.GetPHttp(_url);
            return promesa;

            //Paciente/Listar/Name/
        };

        vm.UpdateDate = function () {
            if (vm.Paciente && vm.Paciente.FechaNacimiento)
                vm.Paciente.FechaNacimiento = moment(vm.Paciente.FechaNacimiento).toDate();
        };

    }

})();