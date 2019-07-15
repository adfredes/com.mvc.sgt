(function () {
    var sgtApp = angular.module("sgtApp");

    //sgtApp.controller('feriadoEditController', ['crudService', feriadoEditController]);

    sgtApp.component('feriadoEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditFeriado',
        controller: ['crudService', 'messageService', '$element', feriadoEditController],
        bindings: {
            feriado: "<",
            onSave: "&?"
        }
    });

    function feriadoEditController(crudService, messageService, $element) {
        var vm = this;
        vm.error = "";
        let fecha;

        vm.save = function (data) {
            //var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', data);
            //promise.then(function (data) {
            //    if (vm.onSave) {
            //        vm.onSave()();
            //    }
                existenSesiones();
            //    //$('#CreateOrUpdateFeriado').modal('hide');
            //})
            //    .catch(function (error) {
            //        vm.error = error.data;
            //    }
            //    );
        };

        let CreateOrUpdate = data => {
            var promise = crudService.PostHttp('/Agenda/CreateOrEditFeriado', data);
            promise.then(function (datos) {
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

        vm.$onChanges = (change) => {
            fecha = moment(vm.feriado.Fecha).toDate();            
            vm.feriado.Fecha = moment(vm.feriado.Fecha).toDate();            
        };

        let existenSesiones = () => {                        
            //let _url = `api/grilla/existesesiones/desde/${vm.feriado.Fecha.getDate()}/${vm.feriado.Fecha.getMonth() + 1}/${vm.feriado.Fecha.getYear()}/hasta/${vm.feriado.Fecha.getDate()}/${vm.feriado.Fecha.getMonth() + 1}/${vm.feriado.Fecha.getYear()}`;            
            crudService.GetPHttp(`api/grilla/existesesiones/desde/${vm.feriado.Fecha.getDate()}/${vm.feriado.Fecha.getMonth() + 1}/${vm.feriado.Fecha.getFullYear()}/hasta/${vm.feriado.Fecha.getDate()}/${vm.feriado.Fecha.getMonth() + 1}/${vm.feriado.Fecha.getFullYear()}`)
                .then((data) => {
                    if (data) {
                        messageService.Notify('Feriados', 'Existen sesiones asignadas en el feriado.', $element)
                            .then(() => vm.feriado.Fecha = fecha);
                    }
                    else {
                        CreateOrUpdate(vm.feriado);
                        //$('#CreateOrUpdateFeriado').modal('hide');
                    }

                });
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