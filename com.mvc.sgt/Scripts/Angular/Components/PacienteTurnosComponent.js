(function () {
    var sgtApp = angular.module("sgtApp");

    //sgtApp.controller('pacienteTurnosController', ['eventService','pdfService', 'crudService', '$window', '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog', pacienteTurnosController]);

    sgtApp.component('pacienteTurnos', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/ViewTurnos',
        controller: ['messageService','turnoService', 'eventService', 'pdfService', 'crudService', '$window',
            '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog','$element', pacienteTurnosController],
        bindings: {
            paciente: "<?",
            pacienteid: "<?",
            parent: "<?",
            onClose: "&?",
            onAdddiagnostico:"&?"
        }
    });


    sgtApp.component('datosSesiones', {        
        templateUrl: Domain + 'Paciente/DatosSesiones',
        controller: ['turnoService', 'eventService', 'pdfService', 'crudService', '$window',
            '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog', '$element', datosSesionesController]        
    });


    /*
        $onInit
        $onDestroy
        $onChanges(change)
        $postLink
    */

    //sgtApp.controller('DialogController', ['$scope', '$mdDialog', DialogController]);

    function pacienteTurnosController(messageService ,turnoService, eventService, pdfService, crudService,
        $window, $mdSelect, $filter, $location, $route, $timeout, $mdDialog, $element) {
        let vm = this;
        vm.turnos = [];
        let Estados = [];
        let Consultorios = [];
        vm.selectedTurno = {};
        vm.deleteTurno = false;
        let parentModal;
        vm.getInformation = false;
        

        vm.reading = false;

        vm.toDate = function (value) {
            let dateValue = moment(value).toDate();
            return angular.isDate(dateValue) ? getDayName(dateValue) + ' ' + toShortDate(dateValue) : '';
        };

        let getDayName = (value) => {
            let weekday = new Array(7);
            weekday[0] = "Domingo";
            weekday[1] = "Lunes";
            weekday[2] = "Martes";
            weekday[3] = "Miércoles";
            weekday[4] = "Jueves";
            weekday[5] = "Viernes";
            weekday[6] = "Sábado";
            return weekday[value.getDay()];
        };

        let toShortDate = (value) => {
            let sDia = addZero(value.getDate());
            let sMes = addZero(value.getMonth() + 1);
            let sAnio = value.getFullYear();

            let sFecha = sDia + "/" + sMes + "/" + sAnio;

            return sFecha;
        };

        let addZero = (i) =>
            i < 10 ? '0' + i : i;

        vm.toHourRange = function (value, sesiones) {
            return vm.toHour(value) + ' a ' + vm.nextHour(value, sesiones);
        };

        vm.toHour = function (value) {
            let dateValue = moment(value).toDate();
            /*value.setHours(value.getHours() - 3);*/
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };

        vm.nextHour = function (value, sesiones) {
            let dateValue = moment(value).toDate();
            /*value.setHours(value.getHours() - 3);*/
            if (angular.isDate(dateValue))
                dateValue.setMinutes(dateValue.getMinutes() + 30 * sesiones);
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };

        vm.getNombreEstado = function (idEstado) {
            return vm.Estados.find(estado => estado.ID === idEstado).Descripcion;
        };

        vm.getNombreConsultorio = function (idConsultorio) {
            return vm.Consultorios.find(consultorio => consultorio.ID === idConsultorio).Descripcion;
        };

        vm.getColorConsultorio = (idConsultorio) => turnoService.getColorConsultorio(idConsultorio, vm.Consultorios);

        vm.turnoPrint = (turno) =>             
            turnoService.turnoPrint(turno, vm.paciente);              

        vm.sendTurnoWhatsapp = (turno) => {
            window.open(turnoService.linkWhatsapp(turno, vm.paciente));
            
        };

        vm.bolder = (estado) => turnoService.bolder(estado);

        vm.sendTurno = (turno) => {
            turnoService.sendTurno(turno.ID)
                .then(() => messageService.Notify('Turnos', 'Mail enviado.', $element))
                .catch(() => messageService.Notify('Turnos', 'El mail no pudo enviarse.', $element));
        };

        vm.sesionClick = function (fecha) {
            $window.sessionStorage.removeItem('FechaGrillaTurnos');
            $window.sessionStorage.removeItem('VistaGrillaTurnos');
            $window.sessionStorage.setItem('FechaGrillaTurnos', moment(fecha).toDate());
            $window.sessionStorage.setItem('VistaGrillaTurnos', 'd');
            if (vm.onClose) {
                vm.onClose();
            }

            $timeout(() => {
                if ($location.path() == '/Turnos') {
                    $route.reload();
                }
                else {
                    $location.path('/Turnos');
                }
            }, 500);
        };

        vm.cancelarSesionSelect =(ev, turno)=> turnoService.cancelarTurno(turno, promise => {
            promise.then(data => {
                getTurnosPaciente(vm.paciente.ID);
                eventService.UpdateTurnos();
                if (vm.onChanges) {
                    vm.onChanges()();
                }
            });
        }, vm.parent.children());        


        vm.confirmCancelarTurno = function () {
            vm.deleteTurno = false;
        };

        vm.getTipoSesion = (idTipo) => turnoService.getTipoSesion(idTipo);

        let getEstados = () => {
            vm.reading = true;
            let promise = crudService.GetPHttp(`api/grilla/Estados`);
            promise.then(data => {
                vm.Estados = data;
                if (vm.pacienteid) {
                    getTurnosPaciente(vm.pacienteid);
                }
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let getConsultorios = () => {
            let promise = crudService.GetPHttp(`api/grilla/Consultorios`);
            promise.then(data => {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let getTurnosPaciente = (id) => {         
            vm.getInformation = true;            
            console.log(`Paciente/ListTurnos/${id}`);
            let promise = crudService.GetPHttp(`Paciente/ListTurnos/${id}`);
            promise.then(data => {
                vm.reading = false;
                vm.turnos = sesionesOrder(JSON.parse(data));                   
                vm.getInformation = false;
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let sesionesOrder = (data) => 
        {
           
            return turnoService.turnosSesionesOrder(data);
        };
        
        vm.FacturacionTurnoShow = (turno) => {
            
            turnoService.FacturacionTurnoShow(turno, undefined, vm.parent);
        };

        let updateData = () => {
            eventService.UpdateTurnos();
            getTurnosPaciente(vm.paciente.ID);
        };

        vm.openCambiarSesionModal = (sesion) => turnoService.openCambiarSesionModal(sesion, updateData, vm.parent);

        vm.sesionAnular = (id) => turnoService.sesionAnular(id, updateData, vm.parent);

        vm.openDobleOrden = (turno) => {
            turnoService.openDobleOrden(turno,
                (promise) =>
                    promise.then(data => {
                        eventService.UpdateTurnos();
                        let indice = vm.turnos.findIndex(e => e.ID = turno.ID);
                        vm.turnos[indice] = turnoService.sesionesOrder(JSON.parse(data));
                        vm.turnos[indice].visible = turno.visible;
                        vm.turnos[indice].begin = turno.begin;
                        vm.turnos[indice].end = turno.end;
                    })
                        .catch(error => { }), vm.parent.parent()
            );
        };

        //vm.$onInit = () => {
        //    vm.deleteTurno = false;
        //    getConsultorios();
        //};

        vm.$onChanges = (change) => {            
            if (change.pacienteid) {

            
                vm.turnos = [];
                Estados = [];
                Consultorios = [];
                vm.deleteTurno = false;
                getConsultorios();
                if (vm.parent) {
                    parentModal = vm.parent.parent().parent().parent().parent();                    
                }
                else {
                    vm.parent = $element.parent().parent().parent().parent().parent();
                 }
            }
        };

        vm.openDiagnostico = (turno) => {
            turnoService.openDiagnostico(vm.paciente, turno,
                (promise) =>
                    promise.then(data => {                        
                        eventService.UpdateTurnos();                        
                        if (vm.onAdddiagnostico) {                            
                            vm.onAdddiagnostico()();
                        }
                    })
                        .catch(error => { }), vm.parent.parent()
            );
        };


        vm.showModal = function (ev) {            
            let modalHtml = `
                <md-dialog aria-label="Turnos">
                  <form ng-cloak>
                    <md-toolbar>
                      <div class="md-toolbar-tools  badge-warning">
                        <h5 class="modal-title">Turnos</h5>        
                      </div>
                    </md-toolbar>
                    <md-dialog-content>
                      <div class="md-dialog-content">        
                        <p>
                          Esta seguro que desea cancelar el turno ${vm.selectedTurno.ID}?
                        </p>
                      </div>
                    </md-dialog-content>

                    <md-dialog-actions layout="row">      
                      <span flex></span>
                      <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>
                      <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> Aceptar</md-button>
                    </md-dialog-actions>
                  </form>
                </md-dialog>
                `;

            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                template: modalHtml,
                controller:  DialogController,
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: vm.selectedTurno}
            })
                .then(answer => {                    
                    let url = "Sesion/Pendiente/Anular";
                    let params = {};
                    params.id = vm.selectedTurno.ID;
                    let promise = crudService.PutHttp(url, params);
                    promise.then(data => {                        
                        getTurnosPaciente(vm.paciente.ID);
                        eventService.UpdateTurnos();
                        /*let event = document.createEvent('Event');
                        event.initEvent('UpdateTurnos', true, true);
                        document.dispatchEvent(event);*/
                    })
                        .catch(err => {});
                 });            
        };

        function DialogController($scope, $mdDialog) {
            
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }


    }


    function datosSesionesController(turnoService, eventService, pdfService, crudService,
        $window, $mdSelect, $filter, $location, $route, $timeout, $mdDialog, $element) {
        let vm = this;
        vm.paciente = {};        
        vm.PacienteID = 0;
        vm.TurnoID = 0;
        vm.parent = $element.children();        

        vm.$onInit = () => init;



        let init = () => {            
            getPaciente(vm.PacienteID);
        };


        vm.pacienteChange = () => {
            init();
        };              

        let getPaciente = id => {
            if (id && id > 0) {
                let promise = turnoService.getPaciente(id);
                promise.then(data => {
                    vm.paciente = JSON.parse(data);
                })
                    .catch(err => { vm.paciente = []; vm.reading = false; });
            }
            else {
                vm.paciente = {};
            }
        };

     


        vm.turnoChange = () => {
            init();
        };

        vm.$onChanges = (change) => {
            init();
        };

        vm.close = () => {
            $('#DatosSesiones').modal('hide');            
        };


              
    }
    
})();

