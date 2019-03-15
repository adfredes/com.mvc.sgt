(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.service("turnoService", ['crudService', 'pdfService', '$mdDialog', turnoServiceController]);

    function turnoServiceController(crudService, pdfService, $mdDialog) {
        var $this = this;


        $this.toDate = function (value) {
            let dateValue = moment(value).toDate();
            return angular.isDate(dateValue) ? $this.getDayName(dateValue) + ' ' + $this.toShortDate(dateValue) : '';
        };

        $this.getDayName = (value) => {
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

        $this.toShortDate = (value) => {
            let sDia = $this.addZero(value.getDate());
            let sMes = $this.addZero(value.getMonth() + 1);
            let sAnio = value.getFullYear();

            let sFecha = sDia + "/" + sMes + "/" + sAnio;

            return sFecha;
        };

        $this.addZero = (i) =>
            i < 10 ? '0' + i : i;

        $this.toHourRange = (value, sesiones) => $this.toHour(value) + ' a ' + $this.nextHour(value, sesiones);


        $this.toHour = value => {
            let dateValue = moment(value).toDate();
            return angular.isDate(dateValue) ? $this.addZero(dateValue.getHours()) + ':' + $this.addZero(dateValue.getMinutes()) : '';
        };

        $this.nextHour = (value, sesiones) => {
            let dateValue = moment(value).toDate();
            if (angular.isDate(dateValue))
                dateValue.setMinutes(dateValue.getMinutes() + 30 * sesiones);
            return angular.isDate(dateValue) ? $this.addZero(dateValue.getHours()) + ':' + $this.addZero(dateValue.getMinutes()) : '';
        };

        $this.turnoPrint = (turno, paciente, Consultorios, Estados) => {
            //pdfService.CreateTurnoPdf($window.document.querySelector('#div' + fecha).innerHTML);       
            let body = [];
            let estadosImprimible = [1, 2, 4, 5];
            turno.Sesions.forEach(sesion => {
                let row = [];
                if (estadosImprimible.includes(sesion.Estado)) {
                    row.push(sesion.Numero.toString());
                    row.push($this.toDate(sesion.FechaHora));
                    row.push($this.toHourRange(sesion.FechaHora, sesion.sesiones));
                    row.push($this.getNombreConsultorio(sesion.ConsultorioID, Consultorios));
                    body.unshift(row);
                }
            });
            body.unshift(['Número', 'Fecha', 'Horario', 'Consultorio']);

            let headerText = `Turno: ${turno.ID} - ${paciente.Apellido}, ${paciente.Nombre}`;
            pdfService.CreateTurnoPdf(body, headerText);
        };


        $this.getEstados = () => crudService.GetPHttp(`api/grilla/Estados`);

        $this.getConsultorios = () => crudService.GetPHttp(`api/grilla/Consultorios`);

        //Obtengo los horarios libres de los consultorios en una fecha específica
        $this.getConsultoriosFecha = (fechaConsultorio) => crudService.GetPHttp(`Consultorio/ListarHorarios/${fechaConsultorio.getFullYear()}/${fechaConsultorio.getMonth() + 1}/${fechaConsultorio.getDate()}`);
            

        $this.getNombreEstado = (idEstado, Estados) => Estados.find(estado => estado.ID === idEstado).Descripcion;

        $this.getNombreConsultorio = (idConsultorio, Consultorios) => Consultorios.find(consultorio => consultorio.ID === idConsultorio).Descripcion;

        $this.getTurno = id => crudService.GetPHttp(`Turno/${id}`);

        $this.getSesion = id => crudService.GetPHttp(`api/sesiones/${id}`);

        $this.getTurnosPaciente = (id) => crudService.GetPHttp(`Paciente/ListTurnos/${id}`);            

        $this.getPaciente = id => crudService.GetPHttp(`Paciente/Get/${id}`);

        $this.turnosSesionesOrder = (data) => {
            data.forEach(turno => {
                turno = $this.sesionesOrder(turno);
                let fechaActual = new Date();
                if (fechaActual.getTime() <= moment(turno.Sesions[0].FechaHora).toDate().getTime() && fechaActual.getTime() >= moment(turno.Sesions[turno.Sesions.length - 1].FechaHora).toDate().getTime())
                    turno.visible = true;
                else
                    turno.visible = false;
                turno.begin = turno.Sesions[turno.Sesions.length - 1].FechaHora;
                turno.end = turno.Sesions[0].FechaHora;
            });
            return data;
        };

        $this.sesionesOrder = (data) => {
            let sesiones = JSON.parse(JSON.stringify(data.Sesions.filter((value, index, self) =>
                self.findIndex(element => element.Numero === value.Numero && element.ID < value.ID + 3
                    && element.Estado === value.Estado && element.ConsultorioID === value.ConsultorioID
                    && element.TurnoSimultaneo === value.TurnoSimultaneo
                )
                === index
            )));

            sesiones.forEach(mValue => {
                let result = data.Sesions.filter(fValue =>
                    mValue.ID + 3 > fValue.ID && mValue.Numero === fValue.Numero
                    && mValue.Estado === fValue.Estado && mValue.ConsultorioID === fValue.ConsultorioID
                    && mValue.TurnoSimultaneo === fValue.TurnoSimultaneo
                ).length;
                mValue.sesiones = result;
            });
            data.Sesions = sesiones.sort((a, b) => b.Numero - a.Numero
            );

            return data;
        };

        /*$this.cancelarTurno = (TurnoID) => {
            let url = "Sesion/Pendiente/Anular";
            let params = {};
            params.id = TurnoID;
            let promise = crudService.PutHttp(url, params);
            return promise;
        };*/

        $this.asignarPaciente = (turno) => {
            let url = "Turno/AsignarPaciente";                        
            let promise = crudService.PutHttp(url, turno);
            return promise;

        };

        $this.AgregarSesionesTurno = (turno, success) => {
            
            let modalHtml = `<md-dialog aria-label="Turnos">
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-warning">
                                    <h5 class="modal-title">Agregar Sesiones</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">                                            
                                        <input type="number" ng-model="cantidad"/>                                                                        
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>
                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer()'><span class='icon-ok'></span> Aceptar</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;
            function DialogController($scope, $mdDialog) {
                $scope.cantidad = 4;
                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.answer = function () {
                    $mdDialog.hide($scope.cantidad);
                };
            }

            $mdDialog.show({
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(answer => {
                    let url = "Turno/AgregarSesiones";
                    let params = {};
                    
                    turno.CantidadSesiones = turno.CantidadSesiones + answer;
                    params.modal = turno;                    
                    console.dir(turno);
                    let promise = crudService.PutHttp(url, turno);
                    success(promise);
                })
                .catch(() => undefined);


        };

        $this.cancelarTurno = (TurnoID, success) => {
            let modalHtml = `<md-dialog aria-label="Turnos">
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-warning">
                                    <h5 class="modal-title">Turnos</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <p>
                                      Esta seguro que desea cancelar el turno ${TurnoID}?
                                    </p>
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>
                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> Aceptar</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;
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

            $mdDialog.show({
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { TurnoID: TurnoID }
            })
                .then(answer => {
                    let url = "Sesion/Pendiente/Anular";
                    let params = {};
                    params.id = TurnoID;
                    let promise = crudService.PutHttp(url, params);
                    success(promise);
                })
                .catch(() => undefined);


        };

        $this.confirmarTurno = (turno) => {
            let url = "Turno/Confirmar";
            let promise = crudService.PutHttp(url, turno);
            return promise;
        };

        $this.openCambiarSesionModal = (sesion, success) => {
            let modalHtml = `<md-dialog aria-label="Turnos">
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-primary">
                                    <h5 class="modal-title">Turno - Diagnóstico</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <md-input-container class="md-block">
                                        <label>Diagnóstico</label>
                                            <textarea ng-model="diagnostico" maxlength="150" md-maxlength="150" rows="3" md-select-on-focus" ng-init="${turno.Diagnostico}"></textarea>
                                    </md-input-container>
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>
                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cerrar</md-button>
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(diagnostico)'><span class='icon-save'></span> Guardar</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;
            function DialogController($scope, $mdDialog) {
                $scope.diagnostico = turno.Diagnostico;
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

            $mdDialog.show({
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(answer => {
                    turno.Diagnostico = answer;
                    let url = "Turno/Diagnostico";
                    let promise = crudService.PutHttp(url, turno);
                    success(promise);
                })
                .catch(() => undefined);
        };        
        
        $this.openCambiarSesionModal = (sesion) => {
            let modalHtml = `<md-dialog aria-label="Paciente">
                                <md-toolbar>
                                    <div class="md-toolbar-tools  badge-warning">
                                        <h5 class="modal-title">Cambiar Turno</h5>
                                    </div>
                                </md-toolbar>
                                <sesion-edit-modal sesion="sesion" on-save="answer" on-cancel="cancel" />
                            </md-dialog>`;

            function DialogController($scope, $mdDialog) {
                $scope.sesion = sesion;
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

            $mdDialog.show({
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false
                //,
                //locals: { turno: turno }
            })
                .then(answer => {

                })
                .catch(() => undefined);
        };
        $this.openDiagnostico = (turno, success) => {
            let modalHtml = `<md-dialog aria-label="Turnos">
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-primary">
                                    <h5 class="modal-title">Turno - Diagnóstico</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <md-input-container class="md-block">
                                        <label>Diagnóstico</label>
                                            <textarea ng-model="diagnostico" maxlength="150" md-maxlength="150" rows="3" md-select-on-focus" ng-init="${turno.Diagnostico}"></textarea>
                                    </md-input-container>
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>
                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cerrar</md-button>
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(diagnostico)'><span class='icon-save'></span> Guardar</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;
            function DialogController($scope, $mdDialog) {
                $scope.diagnostico = turno.Diagnostico;
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

            $mdDialog.show({
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(answer => {                                                            
                    turno.Diagnostico = answer;                    
                    let url = "Turno/Diagnostico";                         
                    let promise = crudService.PutHttp(url, turno);                    
                    success(promise);                    
                })
                .catch(() => undefined);
        };        

        $this.setEstadoAsistio = sesionsID => {
            let url = "Sesion/Estados/Asistio";
            let params = {};
            params.ids = sesionsID;
            let promise = crudService.PutHttp(url, params);
            return promise;
        };

        $this.setEstadoNoAsistio = sesionsID => {
            let url = "Sesion/Estados/NoAsistio";
            let params = {};
            params.ids = sesionsID;
            let promise = crudService.PutHttp(url, params);
            return promise;
        };

    }
}
)();