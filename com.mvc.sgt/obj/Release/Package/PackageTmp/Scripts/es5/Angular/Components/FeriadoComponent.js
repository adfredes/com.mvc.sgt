(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('feriadoEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditFeriado',
        controller: ['crudService', feriadoEditController],
        bindings: {
            feriado: "<",
            onSave: "&?"
        }
    });
    function feriadoEditController(crudService) {
        var vm = this;
        vm.error = "";
        vm.save = function (data) {
            var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', data);
            promise.then(function (data) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                $('#CreateOrUpdateFeriado').modal('hide');
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
    }
})();
//# sourceMappingURL=FeriadoComponent.js.map