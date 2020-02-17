(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('profesionalAusenciaEdit2', {
        templateUrl: Domain + '/Profesional/Ausencias/CreateOrEdit',
        controller: ['crudService', 'messageService', '$element', profesionalAusenciaEditController],
        bindings: {
            ausencia: "<",
            onSave: "&?"
        }
    });
    function profesionalAusenciaEditController(crudService, messageService, $element) {
        var vm = this;
        vm.error = "";
        var fecha;
        vm.save = function (data) { return CreateOrUpdate(data); };
        var CreateOrUpdate = function (data) {
            var promise = crudService.PostHttp('/Profesional/Ausencias/CreateOrEdit', data);
            promise.then(function (datos) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                $('#CreateOrUpdatePacienteAusencia').modal('hide');
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
        vm.$onChanges = function (change) {
            getProfesionales();
        };
        var getProfesionales = function () {
            var promise = crudService.GetPHttp('/Profesional/Listar/Combo');
            promise.then(function (datos) {
                vm.Profesionales = datos;
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
    }
})();
//# sourceMappingURL=ProfesionalAusenciaComponent.js.map