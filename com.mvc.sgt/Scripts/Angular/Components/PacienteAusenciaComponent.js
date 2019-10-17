(function () {
    var sgtApp = angular.module("sgtApp");

    //sgtApp.controller('feriadoEditController', ['crudService', feriadoEditController]);

    sgtApp.component('profesionalAusenciaEdit', {
        templateUrl: Domain + '/Profesional/Ausencias/CreateOrEdit',
        controller: ['crudService', 'messageService', '$element', feriadoEditController],
        bindings: {
            ausencia: "<",
            onSave: "&?"
        }
    });

    function feriadoEditController(crudService, messageService, $element) {
        var vm = this;
        vm.error = "";
        let fecha;

        vm.save = (data) => CreateOrUpdate(data);

        let CreateOrUpdate = data => {
            var promise = crudService.PostHttp('/Profesional/Ausencias/CreateOrEdit', data);
            promise.then(function (datos) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                $('#CreateOrUpdatePacienteAusencia').modal('hide');
            })
                .catch(function (error) {
                    vm.error = error.data;
                }
                );
        };

        vm.$onChanges = (change) => {
            getProfesionales();
        };

        let getProfesionales = () => {
            var promise = crudService.GetPHttp('/Profesional/Listar/Combo');
            promise.then(function (datos) {
                vm.Profesionales = datos;
            })
                .catch(function (error) {
                    vm.error = error.data;
                }
                );
        };
        

    }
   
})();