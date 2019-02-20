(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.controller('pacienteViewController', ['crudService', '$window', '$mdSelect', '$filter', pacienteViewController]);

    sgtApp.component('pacienteView', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/View',
        controller: pacienteViewController,
        bindings: {
            paciente: "<?",
            save: "&?",
            divid: "@"
        }
    });


    /*
        $onInit
        $onDestroy
        $onChanges(change)
        $postLink
    */

    function pacienteViewController(crudService, $window, $mdSelect, $filter) {
        var vm = this;
        //vm.paciente = {};
        vm.Provincias = [];
        vm.Localidades = [];
        vm.ObrasSociales = [];
        vm.Planes = [];
        vm.selectedIndex = 0;
        //let prevpacienteid = angular.copy(vm.paciente.ID);

        let loadPaciente = (id) => {
            vm.selectedIndex = 0;
            let promise = crudService.GetPHttp(`Paciente/Get/${id}`);
            promise.then(data => {
                vm.paciente = data;                
                vm.paciente.FechaModificacion = moment(vm.paciente.FechaModificacion).toDate();
                vm.paciente.FechaNacimiento = moment(vm.paciente.FechaNacimiento).toDate();
                vm.getLocalidades();
                vm.getPlanes();
            })
                .catch(err => vm.paciente = {});
        };


        vm.hiddenChange = (e) => {
            if (!vm.paciente.ID || vm.paciente.ID === 0) {
                vm.paciente = {};
            }
            else {
                loadPaciente(vm.paciente.ID);
            }
        };

        $window.document.addEventListener('click', function (e) {
            e.stopImmediatePropagation();
            if (!(e.target.nodeName === 'MD-SELECT' || e.target.nodeName === 'SPAN')) {
                $mdSelect.hide();
            }
        });


        vm.MdHide = function () {
            $mdSelect.destroy();
        };

        vm.$onInit = () => {

            vm.paciente = vm.paciente ? vm.paciente : {};
            vm.paciente.ID = vm.paciente.ID ? vm.paciente.ID : 0;
            vm.paciente.AseguradoraID = vm.paciente.AseguradoraID ? vm.paciente.AseguradoraID : 0;
            vm.paciente.ProvinciaID = vm.paciente.ProvinciaID ? vm.paciente.ProvinciaID : 0;
            getProvincias();
            getObrasSociales();
            vm.selectedIndex = 0;
        };

        vm.$onChanges = (change) => {
            if (change.paciente && !change.paciente.isFirstChange()) {
                vm.getLocalidades();
                vm.getPlanes();
            }
            vm.selectedIndex = 0;
        };


        //Manejo de Provincia Localidad                


        function getProvincias() {
            let _url = 'api/provincia/all/cmb';
            var requestResponse = crudService.GetHttp(_url);
            requestResponse.then(function (response) {
                vm.Provincias = response.data;
                if (!vm.paciente.ProvinciaID) {
                    vm.paciente.ProvinciaID = vm.Provincias[0].Value;
                }
            },
                function () {
                    vm.Provincias = [];
                });
        }

        vm.getLocalidades = () => {
            if (vm.paciente && vm.paciente.ProvinciaID) {
                let _url = 'api/provincia/' + vm.paciente.ProvinciaID + '/localidad/all/cmb';
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    vm.Localidades = response.data;
                },
                    function () {
                        vm.Localidades = [];
                    });
            }
        };

        //Manejo de Obra Social

        getObrasSociales = () => {
            let _url = 'api/aseguradora/all/cmb';
            var requestResponse = crudService.GetHttp(_url);
            requestResponse.then(function (response) {
                vm.ObrasSociales = response.data;
                if (!vm.paciente.AseguradoraID) {
                    vm.paciente.AseguradoraID = vm.ObrasSociales[0].Value;
                }

            },
                function () {
                    vm.ObrasSociales = [];
                });
        };


        vm.getPlanes = () => {
            if (vm.paciente && vm.paciente.AseguradoraID) {
                let _url = 'api/aseguradora/' + vm.paciente.AseguradoraID + '/plan/all/cmb';
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    vm.Planes = response.data;
                },
                    function () {
                        vm.Planes = [];
                    });
            }
        };

        vm.isValidDate = (date) => {
            return angular.isDate(date);
        };

        vm.close = () => {            
            $('#' + vm.divid).modal('hide');
            vm.frmPaciente.$setPristine();
            vm.frmPaciente.$setUntouched();            
        };

        vm.setTouch = () => {
            angular.forEach(vm.frmPaciente.$error, (field) => angular.forEach(field, (errorField) => {
                errorField.$setTouched();
            }));
        };

        vm.savePaciente = () => {
            vm.setTouch();
            if (vm.frmPaciente.$valid) {
                let requestResponse = crudService.CreateOrEdit(vm.paciente, 'Paciente');
                Message(requestResponse);
            }
        };

        Message = (requestResponse) => {
            requestResponse.then(function successCallback(response) {
                vm.close();                                
                if (vm.save) {
                    vm.save({ newPaciente: vm.paciente });
                }
            }, function errorCallback(response) {

            });
        };        


    }
})();