(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('recesoEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditReceso',
        controller: ['crudService', recesoEditController],
        bindings: {
            receso: "<",
            onSave: "&?"
        }
    });
    function recesoEditController(crudService) {
        var vm = this;
        vm.error = "";
        vm.save = function (data) {
            var promise = crudService.PostHttp('/Agenda/CreateOrEditReceso', data);
            promise.then(function (data) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                $('#CreateOrUpdateReceso').modal('hide');
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
    }
})();
//# sourceMappingURL=RecesoComponent.js.map