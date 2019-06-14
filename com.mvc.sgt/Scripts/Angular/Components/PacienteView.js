(function () {

    var sgtApp = angular.module("sgtApp");
    

    sgtApp.component('pacienteView', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/View',
        controller: ['crudService', '$window', '$mdSelect', '$filter', pacienteViewController],
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
        vm.takeFoto = false;        
        vm.uploading = false;
        vm.files = [];
        vm.uploadingText = "";
       

        let loadPaciente = (id) => {
            vm.selectedIndex = 0;
            let promise = crudService.GetPHttp(`Paciente/Get/${id}`);
            promise.then(data => {                       
                vm.paciente = JSON.parse(data);
                vm.getLocalidades();
                vm.getPlanes();
                loadDiagnostico(id);
                getFiles(id);
            })
                .catch(err => vm.paciente = {});
        };   

        let loadDiagnostico = (id) => {
            let promise = crudService.GetPHttp(`Paciente/${id}/Diagnostico`);
            promise.then(data => {                     
                vm.diagnosticos = JSON.parse(data);                          
            })
                .catch(err => vm.diagnosticos = {});

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
                vm.uploadingText = "";
                vm.uploading = false;
            }
            if (vm.paciente && vm.paciente.ID){
                loadDiagnostico(vm.paciente.ID);
                getFiles(vm.paciente.ID);
            }
            vm.selectedIndex = 0;
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

        vm.downloadFile = file => {
            let _url = `Paciente/File/${file.ID}`;
            let promise = crudService.GetPHttp(_url);
            promise.then(data => generateLink(data))
                .catch(error => error = []);
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
            //console.log("Tamaño: " + base64.length);
            mFile.Habilitado = true;
            let promise = crudService.PostHttp("Paciente/File", mFile);
            promise.then((data) => {                
                vm.uploading = false;
                //console.log(vm.paciente.ID);
                getFiles(vm.paciente.ID);
            })
                .catch((error) => {
                    vm.uploadingText = "No fue posible subir el archivo."                                        
                });
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
            console.log(vm.divid);
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
                console.log(response);
                vm.close();                                
                if (vm.save) {
                    vm.save({ newPaciente: vm.paciente });
                }
            }, function errorCallback(response) {
                console.log(response);
            });
        };        


    }

   
    


})();