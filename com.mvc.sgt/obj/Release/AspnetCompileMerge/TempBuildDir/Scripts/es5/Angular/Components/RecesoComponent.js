(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('recesoEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditReceso',
        controller: ['crudService', 'messageService', '$element', recesoEditController],
        bindings: {
            receso: "<",
            onSave: "&?"
        }
    });
    function recesoEditController(crudService, messageService, $element) {
        var vm = this;
        vm.error = "";
        var oldReceso = {};
        vm.save = function (data) {
            existenSesiones();
        };
        var createOrUpdate = function (data) {
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
        vm.$onChanges = function (change) {
            vm.receso.FechaDesde = moment(vm.receso.FechaDesde).toDate();
            vm.receso.FechaHasta = moment(vm.receso.FechaHasta).toDate();
            oldReceso = JSON.parse(JSON.stringify(vm.receso));
        };
        var existenSesiones = function () {
            crudService.GetPHttp("api/grilla/existesesiones/desde/" + vm.receso.FechaDesde.getDate() + "/" + (vm.receso.FechaDesde.getMonth() + 1) + "/" + vm.receso.FechaDesde.getFullYear() + "/hasta/" + vm.receso.FechaHasta.getDate() + "/" + (vm.receso.FechaHasta.getMonth() + 1) + "/" + vm.receso.FechaHasta.getFullYear())
                .then(function (data) {
                if (data) {
                    messageService.Notify('Recesos', 'Existen sesiones asignadas en el receso indicado', $element)
                        .then(function () {
                        vm.receso = JSON.parse(JSON.stringify(oldReceso));
                        vm.receso.FechaDesde = moment(vm.receso.FechaDesde).toDate();
                        vm.receso.FechaHasta = moment(vm.receso.FechaHasta).toDate();
                    });
                }
                else {
                    createOrUpdate(vm.receso);
                }
            });
        };
    }
})();
//# sourceMappingURL=RecesoComponent.js.map