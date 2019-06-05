(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('consultorioEdit', {
        templateUrl: Domain + 'Consultorio/CreateOrEdit',
        controller: ['crudService', consultorioEditController],
        bindings: {
            consultorio: "="
        }
    });
    function consultorioEditController(crudService) {
        var vm = this;
        vm.error = '';
        vm.Tipos = [];
        (function GetTiposSesion() {
            var promise = crudService.GetPHttp('api/tiposesion/all/cmb');
            promise.then(function (data) { return vm.Tipos = data; })
                .catch(function (err) {
                vm.Tipos = [];
            });
        })();
        vm.save = function (data) {
            var promise = crudService.PostHttp('/Consultorio/CreateOrEdit', data);
            promise.then(function (data) {
                $('#CreateOrUpdate').modal('hide');
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
    }
})();
//# sourceMappingURL=ConsultorioComponent.js.map