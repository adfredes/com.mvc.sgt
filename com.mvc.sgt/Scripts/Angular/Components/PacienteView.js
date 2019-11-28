(function () {

    var sgtApp = angular.module("sgtApp");
    

    sgtApp.component('pacienteView', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/View',
        controller: ['eventService','messageService','turnoService','crudService', '$window', '$mdSelect', '$filter','$element', pacienteViewController],
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

    function pacienteViewController(eventService, messageService, turnoService, crudService, $window, $mdSelect, $filter, $element) {
        var vm = this;
        //vm.paciente = {};
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
        vm.saving = false;

        vm.getTipoSesion = (idTipo) => turnoService.getTipoSesion(idTipo);
       

        let loadPaciente = (id) => {            
            
            vm.paciente = {
                ID: 0,
                Celular: "5411"
            };
            vm.selectedIndex = 0;
            if (id && id > 0) {
                vm.saving = true;
                let promise = crudService.GetPHttp(`Paciente/Get/${id}`);
                promise.then(data => {
                    vm.paciente = JSON.parse(data);
                    vm.pacienteid = vm.paciente.ID;
                    vm.saving = false;
                    vm.getLocalidades();
                    vm.getPlanes();
                    loadDiagnostico(vm.paciente.ID);
                    getFiles(id);
                })
                    .catch(err => {
                        vm.saving = false;
                        vm.paciente = { ID: 0 };
                    });
            }
            else {
                vm.getLocalidades();
                vm.getPlanes();
            }
            
        };   

        let loadDiagnostico = (id) => {
            vm.OldDiagnostico = '';
            if (id) {
                let promise = crudService.GetPHttp(`Paciente/${id}/Diagnostico`);
                promise.then(data => {
                    vm.diagnosticos = JSON.parse(data);
                    vm.diagnosticos.forEach(d => {
                        if (d.TurnoID == 0) {
                            vm.OldDiagnostico = `${unescape(d.Diagnostico)}`;
                        }

                    });
                })
                    .catch(err => vm.diagnosticos = {});
            }            
        };

        let pacienteChange = () => {
            vm.diagnosticos = [];
            vm.files = [];
            vm.OldDiagnostico = "";
            if (!vm.paciente || !vm.paciente.ID || vm.paciente.ID === 0) {
                vm.paciente = { ID: 0 };
            }
            else {
                vm.paciente = { ID: vm.paciente.ID };
            }

            vm.uploadingText = "";
            vm.uploading = false;
            loadPaciente(vm.paciente.ID);
            vm.selectedIndex = 0;
        };

        vm.hiddenChange = (e) => pacienteChange();

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
            init();          
        };

        let init = () => {
            //vm.paciente = vm.paciente ? vm.paciente : {};
            vm.paciente.AseguradoraID = vm.paciente.AseguradoraID ? vm.paciente.AseguradoraID : 0;
            vm.paciente.ProvinciaID = vm.paciente.ProvinciaID ? vm.paciente.ProvinciaID : 0;
            getProvincias();
            getObrasSociales();
            vm.selectedIndex = 0;
        };

        vm.$onChanges = (change) => pacienteChange();

        vm.decode = (value) => {
            
            return unescape(value);
        };

        vm.reloadDiagnostico = function () {            
            loadDiagnostico(vm.paciente.ID);
        };

        vm.takedPhoto = (data) => {
          
            vm.paciente.Foto = data;
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

        vm.addFiles = () => {            
            let iFiles = $window.document.querySelector('#iFile');            
            if (iFiles.files.length > 0) {
                vm.uploading = true;
                vm.uploadingText = "Subiendo archivo...";
                let fileToLoad = iFiles.files[0];
                let fileReader = new FileReader();
                let base64;
                let name = iFiles.files[0].name;
                fileReader.onload = function (fileLoadedEvent) {
                    base64 = fileLoadedEvent.target.result;
                    uploadFile(name, base64);
                };
                fileReader.readAsDataURL(fileToLoad);
            }
            else {
                vm.uploading = true;
                vm.uploadingText = "No selecciono ningún archivo.";
            }
        };

        let getFiles = (id) => {            
            if (id > 0) {
                let _url = `Paciente/${id}/File`;
                let promise = crudService.GetPHttpParse(_url);
                promise.then(data => vm.files = data)
                    .catch(error => vm.files = []);
            }
        };

        vm.deleteFile = file => {            
            messageService.showConfirm('Archivos', 'Esta seguro que desea eliminar el archivo?', 'Aceptar', 'Cancelar', vm.parent)
                .then(() => {
                    let _url = `Paciente/File/${file.ID}`;
                    let promise = crudService.DeleteHttp(_url, file.ID);
                    promise.then(data => getFiles(vm.paciente.ID))
                        .catch(error => error = []);
                });                
        };

        vm.downloadFile = file => {
            let _url = `Paciente/File/${file.ID}`;
            let promise = crudService.GetPHttp(_url);
            promise.then(data => generateLink(data))
                .catch(error => error = []);
        };

        vm.viewFile = file => {                        
            turnoService.viewFile(file.ID, vm.parent);                
        };

        let generateLink = archivo => {
            var dlnk = $window.document.querySelector('#dwnl');
            dlnk.download = archivo.Titulo;
            dlnk.href = archivo.Archivo;
            dlnk.click();
        };

        let uploadFile = (name, base64) => {
            let mFile = {};
            mFile.PacienteID = vm.paciente.ID;
            mFile.Titulo = name;
            mFile.Archivo = base64;
            
            mFile.Habilitado = true;
            let promise = crudService.PostHttp("Paciente/File", mFile);
            promise.then((data) => {                
                vm.uploading = false;
                
                getFiles(vm.paciente.ID);
            })
                .catch((error) => 
                    vm.uploadingText = "No fue posible subir el archivo."                                        
                );
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
            $('#ViewPaciente').modal('hide');
            $('#CreateOrUpdate').modal('hide');            
            $('#' + vm.divid).modal('hide');
            vm.paciente = {};
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
            if (vm.frmPaciente.$valid && vm.saving === false) {
                vm.saving = true;

                crudService.CreateOrEdit(vm.paciente, 'Paciente')
                    .then(function successCallback(response) {                        
                        vm.saving = false;
                        eventService.UpdateTurnos();
                        if (vm.save) {
                            vm.save({ newPaciente: vm.paciente });
                        }
                        vm.close();
                    }, function errorCallback(response) {                            
                        vm.saving = false;
                        let promise = messageService.Notify('Paciente', `Se produjo un error: ${response.data}`, $element);
                        //promise.then(() => {
                        //    if (vm.save) {
                        //        vm.save({ newPaciente: {} });
                        //    }
                        //    vm.close();
                        //});
                    });
            }
        };

        Message = (requestResponse) => {

            requestResponse.then(function successCallback(response) {                                                
                vm.saving = false;
                if (vm.save) {
                    vm.save({ newPaciente: vm.paciente });
                }
                vm.close();                                
            }, function errorCallback(response) {  
                    vm.saving = false;
                    let promise = messageService.Notify('Paciente', `Se produjo un error: ${data.data}`, $element);
                    promise.then(() => {
                        if (vm.save) {
                            vm.save({ newPaciente: {} });
                        }
                        vm.close();
                    });                        
            });
        };        


    }

   
    


})();