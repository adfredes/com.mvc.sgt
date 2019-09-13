(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('pacienteQuickCreate', {
        templateUrl: Domain + 'Paciente/QuickCreate',
        controller: ['crudService', pacienteQuickCreateController],
        bindings: {
            onSave: "&",
            onCancel: "&"
        }
    });
    function pacienteQuickCreateController(crudService) {
        var vm = this;
        vm.saving = false;
        vm.$onInit = function () {
            vm.paciente = {};
            vm.ObrasSociales = [];
            vm.Planes = [];
            getObrasSociales();
        };
        vm.setTouch = function () {
            angular.forEach(vm.frmPaciente.$error, function (field) { return angular.forEach(field, function (errorField) {
                errorField.$setTouched();
            }); });
        };
        vm.save = function () {
            vm.setTouch();
            if (vm.frmPaciente.$valid && vm.saving == false) {
                vm.saving = true;
                var requestResponse = crudService.CreateOrEdit(vm.paciente, 'Paciente');
                Message(requestResponse);
            }
        };
        Message = function (requestResponse) {
            requestResponse.then(function successCallback(response) {
                vm.saving = false;
                if (vm.onSave) {
                    vm.onSave()(response.data);
                }
            }, function errorCallback(response) {
                vm.saving = false;
            });
        };
        vm.close = function () { return vm.onCancel()(); };
        getObrasSociales = function () {
            var _url = 'api/aseguradora/all/cmb';
            var requestResponse = crudService.GetHttp(_url);
            requestResponse.then(function (response) {
                vm.ObrasSociales = response.data;
                vm.paciente.AseguradoraID = vm.ObrasSociales[0].Value;
                vm.getPlanes();
            }, function () {
                vm.ObrasSociales = [];
            });
        };
        vm.getPlanes = function () {
            if (vm.paciente && vm.paciente.AseguradoraID) {
                var _url = 'api/aseguradora/' + vm.paciente.AseguradoraID + '/plan/all/cmb';
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    vm.Planes = response.data;
                }, function () {
                    vm.Planes = [];
                });
            }
        };
    }
})();
//# sourceMappingURL=PacienteQuickCreateComponent.js.map