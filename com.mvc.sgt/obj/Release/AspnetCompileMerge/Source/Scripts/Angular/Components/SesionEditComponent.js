(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.component('sesionEdit', {
        templateUrl: Domain + 'Sesion/ChangeDate',
        controller: ['turnoService', 'eventService', 'crudService', '$mdDialog', '$element', sesionEditController],
        bindings: {
            sesion: "<?",
            divid: "@"
        }
    });

    sgtApp.component('sesionEditModal', {
        templateUrl: Domain + 'Sesion/ChangeDateModal',
        controller: ['turnoService', 'eventService', 'crudService', '$mdDialog', '$element', sesionEditController],
        bindings: {
            sesion: "<?",
            onSave: "&?",
            onCancel: "&?"
        }
    });

    function sesionEditController(turnoService, eventService, crudService, $mdDialog, $element) {
        let vm = this;

        vm.selectedDate = null;
        vm.modulos = null;
        vm.motivo = 9;
        let ConsultorioID;


        vm.toDate = turnoService.toDate;

        vm.toHourRange = turnoService.toHourRange;

        vm.toHour = turnoService.toHour;

        vm.nextHour = turnoService.nextHour;

        let loadSesion = () => {
            let promise = turnoService.getSesion(vm.sesion.ID);
            promise.then(data => {

                vm.sesion = data[0];
                vm.sesion.FechaTurno = moment(vm.sesion.FechaHora).toDate();
                vm.sesion.sesiones = data;
                vm.selectedDate = moment(vm.sesion.FechaHora).toDate();

                vm.modulos = vm.sesion.sesiones.length;
                getConsultorios(vm.selectedDate);
            })
                .catch(err => vm.paciente = {});
        };


        let getConsultorios = (fechaConsultorio) => {
            let promise = turnoService.getConsultoriosFecha(fechaConsultorio);
            promise.then(data => {
                vm.Consultorios = data;
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };


        vm.$onInit = () => {
            vm.modulos = 1;
            vm.motivo = 9;

            if (!vm.sesion || !vm.sesion.ID || vm.sesion.ID === 0) {
                vm.sesion = {};
            }
            else {
                loadSesion();
            }

        };

        vm.$onChange = (changes) => {
            vm.modulos = 1;
            vm.motivo = 9;
            if (!vm.sesion.ID || vm.sesion.ID === 0) {
                vm.sesion = {};
            }
            else {
                loadSesion();
            }
        };

        vm.horaClick = (hora, consultorioID) => {
            //vm.sesion.FechaHora = moment(vm.sesion.FechaHora).getDate()
            ConsultorioID = consultorioID;
            vm.selectedDate.setHours(parseInt(hora.split(':')[0]));
            vm.selectedDate.setMinutes(parseInt(hora.split(':')[1]));
            vm.saveChange();
            //vm.sesion.FechaHora.split("T")[0] + 'T' + hora + ":00";            
        };

        vm.fechaChange = () => {
            getConsultorios(vm.selectedDate);
        };

        vm.changeSesionID = (e) => {
            vm.modulos = 1;
            vm.motivo = 9;
            if (!vm.sesion.ID || vm.sesion.ID === 0) {
                vm.sesion = {};
            }
            else {
                loadSesion();
            }
        };

        vm.closeChange = () => {
            
            if (vm.onCancel) {
                vm.onCancel()();
            }
        };

        vm.saveChange = () => {
            let _sesiones = [];


            for (let i = 0; i < vm.modulos; i++) {
                let _fechaHora = new Date(vm.selectedDate.getTime());
                _fechaHora.setMinutes(_fechaHora.getMinutes() + 30 * i);
                let _sesion = {
                    ID: null,
                    AgendaID: vm.sesion.AgendaID,
                    TurnoID: vm.sesion.TurnoID,
                    Numero: vm.sesion.Numero,
                    ConsultorioID: ConsultorioID,
                    TurnoSimultaneo: 0,
                    Estado: vm.sesion.Estado == 8 ? vm.sesion.Estado : 2,
                    FechaHora: _fechaHora,
                    Habilitado: true
                };
                _sesiones.push(_sesion);

            }

            vm.sesion.sesiones.forEach(s => {
                let _sesion = {
                    ID: s.ID,
                    AgendaID: s.AgendaID,
                    TurnoID: s.TurnoID,
                    Numero: s.Numero,
                    ConsultorioID: s.ConsultorioID,
                    TurnoSimultaneo: s.TurnoSimultaneo,
                    Estado: vm.motivo,
                    FechaHora: s.FechaHora,
                    Habilitado: true
                };
                _sesiones.push(_sesion);
            });

            let url = "Sesion/CambiarFecha";

            let promise = crudService.PutHttp(url, _sesiones);

            promise.then(data => {
                turnoService.IsTurnoSuperpuesto(data[0].TurnoID)
                    .then(answer => {
                        if (answer) {
                            turnoService.Notify('Turnos', 'Existen sesiones superpuestas', $element)
                                .then(() => {
                                    if (vm.onSave) {
                                        vm.onSave()(data);
                                    }
                                    else {
                                        eventService.UpdateTurnos();
                                        $('#' + vm.divid).modal('hide');
                                    }
                                });
                        }
                        else {
                            if (vm.onSave) {
                                vm.onSave()(data);
                            }
                            else {
                                eventService.UpdateTurnos();
                                $('#' + vm.divid).modal('hide');
                            }
                        }

                    });


                //vm.showModal(ev, 'Se modifico correctamente el turno');                
            })
                .catch(err => {
                    vm.showModal(err.data, $element);
                });




        };


        vm.showModal = function (_error, parentEl) {
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
          ${_error}
        </p>
      </div>
    </md-dialog-content>

    <md-dialog-actions layout="row">      
      <span flex></span>      
      <md-button type='button' class='md-raised md-primary' ng-click='hide()'><span class='icon-ok'></span> Aceptar</md-button>
    </md-dialog-actions>
  </form>
</md-dialog>
`;

            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                parent: parentEl,
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                //targetEvent: ev,                
                clickOutsideToClose: true,
                fullscreen: false,
                multiple: true,
                locals: { turno: vm.selectedTurno }
            })
                .then(answer => {
                })
                .catch(err => { });
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
})();