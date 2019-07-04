(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.component('recesoEdit', {
        templateUrl: Domain + '/Agenda/CreateOrEditReceso',
        controller: ['crudService', 'messageService','$element', recesoEditController],
        bindings: {
            receso: "<",
            onSave: "&?"
        }
    });

    function recesoEditController(crudService, messageService, $element) {
        var vm = this;
        vm.error = "";

        vm.save = function (data) {
            var promise = crudService.PostHttp('/Agenda/CreateOrEditReceso', data);
            promise.then(function (data) {
                if (vm.onSave) {
                    vm.onSave()();
                }
                existenSesiones();
                //$('#CreateOrUpdateReceso').modal('hide');
            })
                .catch(function (error) {
                    vm.error = error.data;
                }
                );
        };

        vm.$onChanges = (change) => {
            vm.receso.FechaDesde = moment(vm.receso.FechaDesde).toDate();
            vm.receso.FechaHasta = moment(vm.receso.FechaHasta).toDate();
        };

        let existenSesiones = () => {            
            //let _url = `api/grilla/existesesiones/desde/${vm.receso.FechaDesde.getDate()}/${vm.receso.FechaDesde.getMonth() + 1}/${vm.receso.FechaDesde.getYear()}/hasta/${vm.receso.FechaHasta.getDate()}/${vm.receso.FechaHasta.getMonth() + 1}/${vm.receso.FechaHasta.getYear()}`;            
            crudService.GetPHttp(`api/grilla/existesesiones/desde/${vm.receso.FechaDesde.getDate()}/${vm.receso.FechaDesde.getMonth() + 1}/${vm.receso.FechaDesde.getFullYear()}/hasta/${vm.receso.FechaHasta.getDate()}/${vm.receso.FechaHasta.getMonth() + 1}/${vm.receso.FechaHasta.getFullYear()}`)
                .then((data) => {
                    if (data) {
                        messageService.Notify('Recesos', 'Existen sesiones asignadas en el receso indicado', $element)
                            .then(() => $('#CreateOrUpdateReceso').modal('hide'));
                    }
                    else {
                        $('#CreateOrUpdateReceso').modal('hide');
                    }
                    
                });
        };

    }


})();