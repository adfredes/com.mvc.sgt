(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('profesionalEdit', {
        templateUrl: Domain + 'Profesional/CreateOrEdit',
        controller: ['crudService', '$filter', profesionalEditController],
        bindings: {
            profesional: "<",
            saveCallback: "="
        }
    });
    function profesionalEditController(crudService, $filter) {
        var vm = this;
        vm.error = '';
        vm.Tipos = [];
        vm.checkBoxTipos = {};
        vm.$onInit = function () {
            var promise = crudService.GetPHttp('api/tiposesion/all/cmb');
            promise.then(function (data) {
                vm.Tipos = data;
                vm.checkBoxTipos = {};
            })
                .catch(function (err) {
                vm.Tipos = [];
                vm.checkBoxTipos = {};
            });
        };
        vm.$onChanges = function (change) {
            if (change.profesional && !change.profesional.isFirstChange()) {
                SetFalseCheckboxes(vm.Tipos, vm.checkBoxTipos);
                SetTrueCheckboxes(vm.checkBoxTipos, vm.profesional.TiposDeSesiones);
            }
        };
        SetFalseCheckboxes = function (sesiones, checkboxes) { return sesiones.forEach(function (e) { return checkboxes[e.Value] = false; }); };
        SetTrueCheckboxes = function (checkboxes, sesiones) {
            if (sesiones) {
                sesiones.forEach(function (e) { return checkboxes[e.TipoSesionID.toString()] = true; });
            }
        };
        vm.AddOrDelete = function (idTipo) {
            if (!vm.checkBoxTipos[idTipo]) {
                vm.profesional.TiposDeSesiones = vm.profesional.TiposDeSesiones ? vm.profesional.TiposDeSesiones : [];
                vm.profesional.TiposDeSesiones.push({
                    'ID': 0,
                    'TipoSesionID': idTipo,
                    'ProfesionalID': vm.profesional.ID
                });
            }
            else {
                var i = vm.profesional.TiposDeSesiones.findIndex(function (e) { return e.TipoSesionID == idTipo; });
                vm.profesional.TiposDeSesiones.splice(i, 1);
            }
        };
        vm.save = function (data) {
            var promise = crudService.PostHttp('/Profesional/CreateOrEdit', data);
            promise.then(function (data) {
                $('#CreateOrUpdate').modal('hide');
                vm.saveCallback();
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
        vm.changeHour = function (setValue, element) {
        };
    }
})();
//# sourceMappingURL=ProfesionalComponent.js.map