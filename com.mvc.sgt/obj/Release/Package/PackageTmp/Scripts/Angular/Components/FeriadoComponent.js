(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('feriadoEditController', ['crudService', feriadoEditController]);

    sgtApp.component('feriadoEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditFeriado',
        controller: 'feriadoEditController',
        bindings: {
            feriado: "="
        }
    });

    function feriadoEditController(crudService) {
        var vm = this;
        vm.error = "";

        vm.save = function (data) {          
            var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', data);
            promise.then(function (data) {
                $('#CreateOrUpdate').modal('hide');
            })
                .catch(function (error) {
                    vm.error = error.data;                
                    }
                );
        }

    }
})();