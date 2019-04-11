(function () {
    var sgtApp = angular.module("sgtApp");

    //sgtApp.controller('feriadoEditController', ['crudService', feriadoEditController]);

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
                }
                );
        };

    }

    //sgtApp.component('feriadoList', {
    //    templateUrl: Domain + '/Agenda/Feriados',
    //    controller: ['crudService', feriadoListController],
    //    bindings: {
    //        feriado: "="
    //    }
    //});

    //function feriadoListController(crudService) {
    //    var vm = this;
    //    vm.feriado = {};

    //    vm.GetFeriados = function () {
    //        let _url = 'Agenda/Feriados/Listar';
    //        crudService.GetPHttp(_url)
    //            .then(data => vm.feriados = data)
    //            .catch(err => vm.feriados = []);

    //    };

    //    vm.EditFeriado = function (feriado) {
    //        feriado.Fecha = moment(feriado.Fecha).toDate();
    //        vm.feriado = feriado;
    //    };

    //    vm.CreateFeriado = function (feriado) {
    //        vm.feriado = {};
    //    };
    //}
})();