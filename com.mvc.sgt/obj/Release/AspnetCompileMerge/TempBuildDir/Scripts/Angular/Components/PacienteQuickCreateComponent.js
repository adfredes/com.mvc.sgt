(function () {
    //pacienteQuickCreate
    var sgtApp = angular.module("sgtApp");

    //sgtApp.controller('pacienteViewController', ['crudService', '$window', '$mdSelect', '$filter', pacienteViewController]);

    sgtApp.component('pacienteQuickCreate', {
        
        templateUrl: Domain + 'Paciente/QuickCreate',
        controller: ['crudService',pacienteQuickCreateController],
        bindings: {
            onSave: "&",
            onCancel: "&"
        }
    });

    function pacienteQuickCreateController(crudService) {
        let vm = this;
        vm.saving = false;
        

        vm.$onInit = () => {
            vm.paciente = {};
            vm.ObrasSociales = [];
            vm.Planes = [];
            getObrasSociales();
        };

        vm.setTouch = () => {
            angular.forEach(vm.frmPaciente.$error, (field) => angular.forEach(field, (errorField) => {
                errorField.$setTouched();
            }));
        };

        vm.save = () => {
            
            vm.setTouch();
            if (vm.frmPaciente.$valid && vm.saving == false) {
                vm.saving = true;
                let requestResponse = crudService.CreateOrEdit(vm.paciente, 'Paciente');
                Message(requestResponse);                
            }
        };      

        Message = (requestResponse) => {
            requestResponse.then(function successCallback(response) {
                //vm.close();
                vm.saving = false;
                if (vm.onSave) {
                    vm.onSave()(response.data);
                }
            }, function errorCallback(response) {
                    vm.saving = false;
            });
        };    

        vm.close = () => vm.onCancel()();

        getObrasSociales = () => {
            let _url = 'api/aseguradora/all/cmb';
            var requestResponse = crudService.GetHttp(_url);
            requestResponse.then(function (response) {
                vm.ObrasSociales = response.data;                
                vm.paciente.AseguradoraID = vm.ObrasSociales[0].Value;               
                vm.getPlanes();
            },
                function () {
                    vm.ObrasSociales = [];
                });
        };


        vm.getPlanes = () => {
            if (vm.paciente && vm.paciente.AseguradoraID) {
                let _url = 'api/aseguradora/' + vm.paciente.AseguradoraID + '/plan/all/cmb';
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    vm.Planes = response.data;
                },
                    function () {
                        vm.Planes = [];
                    });
            }
        };
    }

}
)();