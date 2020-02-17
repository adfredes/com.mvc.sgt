(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('profesionalSuplencia', {
        templateUrl: Domain + 'Profesional/Suplencias',
        controller: ['crudService', '$filter', profesionalSuplenciaController],
        bindings: {
            ausencia: "<",
            saveCallback: "="
        }
    });
    function profesionalSuplenciaController(crudService, $filter) {
        var vm = this;
        vm.Suplencia = {};
        vm.error = '';
        vm.minHours = '';
        vm.maxHours = '';
        vm.NuevoDia = {};
        vm.Profesionales = [];
        vm.SuplenciasAusencias = [];
        var agenda;
        vm.$onInit = function () {
            vm.Suplencia = {};
            getProfesionales();
            getSuplencias();
            var promise2 = crudService.GetPHttp('Agenda/JSON');
            promise2.then(function (data) {
                agenda = JSON.parse(data);
                vm.minHours = agenda.HoraDesde.split("T")[1];
                vm.maxHours = agenda.HoraHasta.split("T")[1];
            })
                .catch(function (err) {
            });
            var promise3 = crudService.GetPHttp('Agenda/Dias');
            promise3.then(function (data) {
                vm.diasSemana = data;
            })
                .catch(function (err) {
            });
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
        var getSuplencias = function () {
            if (vm.ausencia && vm.ausencia.ID > 0) {
                vm.SuplenciasAusencias = [];
                var promise = crudService.GetPHttp('/Profesional/Suplencias/' + vm.ausencia.ID);
                promise.then(function (datos) {
                    vm.SuplenciasAusencias = JSON.parse(datos);
                })
                    .catch(function (error) {
                    vm.error = error.data;
                });
            }
        };
        vm.addSuplencia = function () {
            var suplencias = [];
            vm.Suplencia.DiaSemana.forEach(function (d) {
                var diaSuplencia = {
                    ProfesionalID: vm.Suplencia.ProfesionalID,
                    AusenciaID: vm.ausencia.ID,
                    DiaSemana: d,
                    HoraDesde: vm.Suplencia.HoraDesde,
                    HoraHasta: vm.Suplencia.HoraHasta,
                    Habilitado: 1
                };
                suplencias.push(diaSuplencia);
            });
            save(suplencias);
        };
        vm.nameOfDay = function (numero) {
            return vm.diasSemana.find(function (e) { return e.Value == numero; });
        };
        vm.$onChanges = function (change) {
            if (change.ausencia) {
                vm.Suplencia = {};
                getSuplencias();
            }
        };
        var save = function (data) {
            var promise = crudService.PostHttp('/Profesional/Suplencias', data);
            promise.then(function (data) {
                vm.Suplencia = {};
                getSuplencias();
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
        vm.delete = function (id) {
            var promise = crudService.DeleteHttp("/Profesional/Suplencias/" + id);
            promise.then(function (data) {
                vm.Suplencia = {};
                getSuplencias();
            })
                .catch(function (error) {
                vm.error = error.data;
            });
        };
        vm.changeHour = function (setValue, element) {
        };
    }
})();
//# sourceMappingURL=SuplenciaComponent.js.map