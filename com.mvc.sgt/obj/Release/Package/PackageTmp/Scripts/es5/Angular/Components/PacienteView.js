(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('pacienteView', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/View',
        controller: ['messageService', 'turnoService', 'crudService', '$window', '$mdSelect', '$filter', '$element', pacienteViewController],
        bindings: {
            paciente: "<?",
            save: "&?",
            divid: "@"
        }
    });
    function pacienteViewController(messageService, turnoService, crudService, $window, $mdSelect, $filter, $element) {
        var vm = this;
        vm.Provincias = [];
        vm.Localidades = [];
        vm.ObrasSociales = [];
        vm.Planes = [];
        vm.selectedIndex = 0;
        vm.takeFoto = false;
        vm.uploading = false;
        vm.files = [];
        vm.uploadingText = "";
        vm.parent = $element.children();
        vm.OldDiagnostico = '';
        vm.paciente = { ID: 0 };
        vm.pacienteid = 0;
        vm.getTipoSesion = function (idTipo) { return turnoService.getTipoSesion(idTipo); };
        var loadPaciente = function (id) {
            vm.paciente = { ID: 0 };
            vm.selectedIndex = 0;
            var promise = crudService.GetPHttp("Paciente/Get/" + id);
            promise.then(function (data) {
                console.log('loaddd');
                vm.paciente = JSON.parse(data);
                vm.pacienteid = vm.paciente.ID;
                vm.getLocalidades();
                vm.getPlanes();
                loadDiagnostico(vm.paciente.ID);
                getFiles(id);
            })
                .catch(function (err) { return vm.paciente = { ID: 0 }; });
        };
        var loadDiagnostico = function (id) {
            vm.OldDiagnostico = '';
            if (id) {
                var promise = crudService.GetPHttp("Paciente/" + id + "/Diagnostico");
                promise.then(function (data) {
                    vm.diagnosticos = JSON.parse(data);
                    vm.diagnosticos.forEach(function (d) {
                        if (d.TurnoID == 0) {
                            vm.OldDiagnostico = "" + unescape(d.Diagnostico);
                        }
                    });
                })
                    .catch(function (err) { return vm.diagnosticos = {}; });
            }
        };
        vm.hiddenChange = function (e) {
            console.log('hidden');
            if (!vm.paciente.ID || vm.paciente.ID === 0) {
                vm.paciente = { ID: 0 };
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
        vm.$onInit = function () {
            init();
        };
        var init = function () {
            vm.paciente.AseguradoraID = vm.paciente.AseguradoraID ? vm.paciente.AseguradoraID : 0;
            vm.paciente.ProvinciaID = vm.paciente.ProvinciaID ? vm.paciente.ProvinciaID : 0;
            getProvincias();
            getObrasSociales();
            vm.selectedIndex = 0;
        };
        vm.$onChanges = function (change) {
            vm.paciente = vm.paciente ? vm.paciente : { ID: 0 };
            if (change.paciente && !change.paciente.isFirstChange()) {
                vm.uploadingText = "";
                vm.uploading = false;
            }
            if (vm.paciente && vm.paciente.ID) {
                loadPaciente(vm.paciente.ID);
            }
            vm.selectedIndex = 0;
        };
        vm.decode = function (value) {
            return unescape(value);
        };
        vm.reloadDiagnostico = function () {
            loadDiagnostico(vm.paciente.ID);
        };
        vm.takedPhoto = function (data) {
            vm.paciente.Foto = data;
        };
        function getProvincias() {
            var _url = 'api/provincia/all/cmb';
            var requestResponse = crudService.GetHttp(_url);
            requestResponse.then(function (response) {
                vm.Provincias = response.data;
                if (!vm.paciente.ProvinciaID) {
                    vm.paciente.ProvinciaID = vm.Provincias[0].Value;
                }
            }, function () {
                vm.Provincias = [];
            });
        }
        vm.getLocalidades = function () {
            if (vm.paciente && vm.paciente.ProvinciaID) {
                var _url = 'api/provincia/' + vm.paciente.ProvinciaID + '/localidad/all/cmb';
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    vm.Localidades = response.data;
                }, function () {
                    vm.Localidades = [];
                });
            }
        };
        vm.addFiles = function () {
            var iFiles = $window.document.querySelector('#iFile');
            if (iFiles.files.length > 0) {
                vm.uploading = true;
                vm.uploadingText = "Subiendo archivo...";
                var fileToLoad = iFiles.files[0];
                var fileReader = new FileReader();
                var base64_1;
                var name_1 = iFiles.files[0].name;
                fileReader.onload = function (fileLoadedEvent) {
                    base64_1 = fileLoadedEvent.target.result;
                    uploadFile(name_1, base64_1);
                };
                fileReader.readAsDataURL(fileToLoad);
            }
            else {
                vm.uploading = true;
                vm.uploadingText = "No selecciono ningún archivo.";
            }
        };
        var getFiles = function (id) {
            if (id > 0) {
                var _url = "Paciente/" + id + "/File";
                var promise = crudService.GetPHttpParse(_url);
                promise.then(function (data) { return vm.files = data; })
                    .catch(function (error) { return vm.files = []; });
            }
        };
        vm.deleteFile = function (file) {
            messageService.showConfirm('Archivos', 'Esta seguro que desea eliminar el archivo?', 'Aceptar', 'Cancelar', vm.parent)
                .then(function () {
                var _url = "Paciente/File/" + file.ID;
                var promise = crudService.DeleteHttp(_url, file.ID);
                promise.then(function (data) { return getFiles(vm.paciente.ID); })
                    .catch(function (error) { return error = []; });
            });
        };
        vm.downloadFile = function (file) {
            var _url = "Paciente/File/" + file.ID;
            var promise = crudService.GetPHttp(_url);
            promise.then(function (data) { return generateLink(data); })
                .catch(function (error) { return error = []; });
        };
        var generateLink = function (archivo) {
            var dlnk = $window.document.querySelector('#dwnl');
            dlnk.download = archivo.Titulo;
            dlnk.href = archivo.Archivo;
            dlnk.click();
        };
        var uploadFile = function (name, base64) {
            var mFile = {};
            mFile.PacienteID = vm.paciente.ID;
            mFile.Titulo = name;
            mFile.Archivo = base64;
            mFile.Habilitado = true;
            var promise = crudService.PostHttp("Paciente/File", mFile);
            promise.then(function (data) {
                vm.uploading = false;
                getFiles(vm.paciente.ID);
            })
                .catch(function (error) {
                return vm.uploadingText = "No fue posible subir el archivo.";
            });
        };
        getObrasSociales = function () {
            var _url = 'api/aseguradora/all/cmb';
            var requestResponse = crudService.GetHttp(_url);
            requestResponse.then(function (response) {
                vm.ObrasSociales = response.data;
                if (!vm.paciente.AseguradoraID) {
                    vm.paciente.AseguradoraID = vm.ObrasSociales[0].Value;
                }
            }, function () {
                vm.ObrasSociales = [];
            });
        };
        vm.getPlanes = function () {
            if (vm.paciente && vm.paciente.AseguradoraID) {
                var _url = 'api/aseguradora/' + vm.paciente.AseguradoraID + '/plan/all/cmb';
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    vm.Planes = response.data;
                }, function () {
                    vm.Planes = [];
                });
            }
        };
        vm.isValidDate = function (date) {
            return angular.isDate(date);
        };
        vm.close = function () {
            $('#ViewPaciente').modal('hide');
            $('#CreateOrUpdate').modal('hide');
            $('#' + vm.divid).modal('hide');
            vm.paciente = {};
            vm.frmPaciente.$setPristine();
            vm.frmPaciente.$setUntouched();
        };
        vm.setTouch = function () {
            angular.forEach(vm.frmPaciente.$error, function (field) { return angular.forEach(field, function (errorField) {
                errorField.$setTouched();
            }); });
        };
        vm.savePaciente = function () {
            vm.setTouch();
            if (vm.frmPaciente.$valid) {
                var requestResponse = crudService.CreateOrEdit(vm.paciente, 'Paciente');
                Message(requestResponse);
            }
        };
        Message = function (requestResponse) {
            requestResponse.then(function successCallback(response) {
                if (vm.save) {
                    vm.save({ newPaciente: vm.paciente });
                }
                vm.close();
            }, function errorCallback(response) {
            });
        };
    }
})();
//# sourceMappingURL=PacienteView.js.map