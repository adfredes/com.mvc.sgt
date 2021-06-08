(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.service("turnoService", ['crudService', 'pdfService', '$mdDialog', turnoServiceController]);

    function turnoServiceController(crudService, pdfService, $mdDialog) {
        let $this = this;

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


        $this.turnoPrint = (turno, paciente) => {
            //pdfService.CreateTurnoPdf($window.document.querySelector('#div' + fecha).innerHTML);       
            let body = [];
            let estadosImprimible = [1, 2, 4, 5];
            turno.Sesions.forEach(sesion => {
                let row = [];
                if (estadosImprimible.includes(sesion.Estado)) {
                    row.push(sesion.Numero.toString());
                    row.push($this.toDate(sesion.FechaHora));
                    row.push($this.toHour(sesion.FechaHora));
                    body.push(row);
                }
            });
            body.unshift(['#', 'Fecha', 'Horario']);

            let headerText = `Turno: ${turno.ID} - ${paciente.Apellido}, ${paciente.Nombre}`;
            pdfService.CreateTurnoPdf(body, headerText);
        };

        $this.bolder = (estado) => {

            if (estado < 9 && estado != 6) {
                return true;
            }
            else {
                return false;
            }
        };

        $this.getEstados = () => crudService.GetPHttp(`api/grilla/Estados`);

        $this.getConsultorios = () => crudService.GetPHttp(`api/grilla/Consultorios`);

        //Obtengo los horarios libres de los consultorios en una fecha específica
        $this.getConsultoriosFecha = (fechaConsultorio) => crudService.GetPHttp(`Consultorio/ListarHorarios/${fechaConsultorio.getFullYear()}/${fechaConsultorio.getMonth() + 1}/${fechaConsultorio.getDate()}`);


        $this.getNombreEstado = (idEstado, Estados) => Estados.find(estado => estado.ID === idEstado).Descripcion;

        $this.getNombreConsultorio = (idConsultorio, Consultorios) => Consultorios.find(consultorio => consultorio.ID === idConsultorio).Descripcion;

        $this.getColorConsultorio = (idConsultorio, Consultorios) => Consultorios.find(consultorio => consultorio.ID === idConsultorio).Color;

        $this.getTurno = id => crudService.GetPHttp(`Turno/${id}`);

        $this.getSesion = id => crudService.GetPHttp(`api/sesiones/${id}`);

        $this.getTurnosPaciente = (id) => crudService.GetPHttp(`Paciente/ListTurnos/${id}`);

        $this.getPaciente = id => crudService.GetPHttp(`Paciente/Get/${id}`);

        $this.turnosSesionesOrder = (data) => {
            data.forEach(turno => {
                turno = $this.sesionesOrder(turno);
                let fechaActual = new Date();
                
                let sesiones = [...turno.Sesions.filter(s => [2, 4, 5, 8].includes(s.Estado))];
                sesiones = sesiones.sort((a, b) => a - b);                
                turno.end = sesiones[sesiones.length - 1].FechaHora;               
                turno.begin = sesiones[0].FechaHora;
                console.log(turno.Sesions[0]);
                if (fechaActual.getTime() >= moment(turno.begin).toDate().getTime() && fechaActual.getTime() <= moment(turno.end).toDate().getTime())
                    turno.visible = true;
                else
                    turno.visible = false;
            });
            return data;
        };        

        $this.sesionesOrder = (data) => {

            let sesiones = JSON.parse(JSON.stringify(data.Sesions.filter((value, index, self) => {

                if ([2, 4, 5, 8].includes(value.Estado)) {
                    return self.findIndex(element => element.Numero === value.Numero //&& element.ID < value.ID + 3                        
                        && element.Estado === value.Estado
                    )
                        === index
                }
                else {
                    return self.findIndex(element => element.Numero === value.Numero //&& element.ID < value.ID + 3
                        //&& element.ID >= value.ID - 1
                        && $this.toShortDate(moment(element.FechaHora).toDate()) == $this.toShortDate(moment(value.FechaHora).toDate())
                        && value.FechaModificacion == element.FechaModificacion
                        //&& moment(value.FechaModificacion).toDate() - moment(element.FechaModificacion).toDate() < 1000
                        && element.Estado === value.Estado && element.ConsultorioID === value.ConsultorioID
                        && element.TurnoSimultaneo === value.TurnoSimultaneo
                    )
                        === index
                }


                
            })));
            

            sesiones.forEach(mValue => {

                let result = data.Sesions.filter(fValue =>
                    //mValue.ID + 3 > fValue.ID && 
                    mValue.Numero === fValue.Numero &&
                    $this.toShortDate(moment(mValue.FechaHora).toDate()) == $this.toShortDate(moment(fValue.FechaHora).toDate())
                    //&& moment(mValue.FechaModificacion).toDate() == moment(fValue.FechaModificacion).toDate()
                    && fValue.FechaModificacion == mValue.FechaModificacion
                    && mValue.Estado === fValue.Estado && mValue.ConsultorioID === fValue.ConsultorioID
                    && mValue.TurnoSimultaneo === fValue.TurnoSimultaneo
                ).length;
                mValue.sesiones = result;
            });            
            //modifico orden
            data.Sesions = sesiones.sort((a, b) => a.Numero - b.Numero);

            return data;
        };

        //$this.sesionesOrder = (data) => {
            
        //    let sesiones = JSON.parse(JSON.stringify(data.Sesions.filter((value, index, self) =>
        //        self.findIndex(element => element.Numero === value.Numero //&& element.ID < value.ID + 3
        //            //&& element.ID >= value.ID - 1
        //            && $this.toShortDate(moment(element.FechaHora).toDate()) == $this.toShortDate(moment(value.FechaHora).toDate())
        //            //&& moment(element.FechaModificacion).toDate() == moment(value.FechaModificacion).toDate()
        //            && element.Estado === value.Estado && element.ConsultorioID === value.ConsultorioID
        //            && element.TurnoSimultaneo === value.TurnoSimultaneo
        //        )
        //        === index
        //    )));

        //    sesiones.forEach(mValue => {
        //        let result = data.Sesions.filter(fValue =>
        //            //mValue.ID + 3 > fValue.ID && 
        //            mValue.Numero === fValue.Numero &&
        //            $this.toShortDate(moment(mValue.FechaHora).toDate()) == $this.toShortDate(moment(fValue.FechaHora).toDate())
        //            //&& moment(mValue.FechaModificacion).toDate() == moment(fValue.FechaModificacion).toDate()
        //            && mValue.Estado === fValue.Estado && mValue.ConsultorioID === fValue.ConsultorioID
        //            && mValue.TurnoSimultaneo === fValue.TurnoSimultaneo
        //        ).length;
        //        mValue.sesiones = result;
        //    });
        //    //modifico orden
        //    data.Sesions = sesiones.sort((a, b) => a.Numero - b.Numero
        //    );

        //    return data;
        //};

        $this.sesionAnular = (sesionID, success, parentEl) => {


            let modalHtml = `<md-dialog aria-label="Turnos" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-warning">
                                    <h5 class="modal-title">Turnos</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <p>
                                      Esta seguro que desea eliminar la sesion?
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
                parent: angular.element(document.body),//parent: parentEl,
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
                
            })
                .then(answer => {
                    let url = "Sesion/Estado/Anular";
                    let params = {};
                    params.id = sesionID;
                    let promise = crudService.PutHttp(url, params);
                    promise.then(() => success());
                })
                .catch(() => undefined);

        };


        $this.getTurnosSinFechaAsignada = () => crudService.GetPHttp('api/turno/SinFechaAsignada');

        $this.asignarPaciente = (turno) => {
            let url = "Turno/AsignarPaciente";
            let promise = crudService.PutHttp(url, turno);
            return promise;

        };

        $this.AgregarSesionesTurno = (turno, success, parentEl) => {

            let modalHtml = `<md-dialog aria-label="Turnos" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-warning">
                                    <h5 class="modal-title">Agregar Sesiones</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">                                                                                    
                                        <div class="form-group">
                                            <label >Sesiones
                                                <input type="number" class="form-control" ng-model="cantidad" placeholder="" min="1">
                                            </label>
                                          </div>
                                          <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="chkAgregarDias" ng-model="continuar">
                                            <label class="form-check-label" for="chkAgregarDias">Continuar sesiones anteriores.</label>
                                          </div>
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
                $scope.cantidad = 1;
                $scope.continuar = true;
                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.answer = function () {
                    $mdDialog.hide({ cantidad: $scope.cantidad, continuar: $scope.continuar });
                };
            }

            $mdDialog.show({
                parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                multiple: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(answer => {                    
                    let url = "Turno/AgregarSesiones";
                    let params = {};
                    params.model = turno;
                    params.sesiones = answer.cantidad;
                    params.continuar = answer.continuar;
                    let promise = crudService.PutHttp(url, params);
                    success(promise);
                })
                .catch(() => undefined);


        };

        $this.cancelarTurno = (turno, success, parentEl) => {
            let modalHtml = `<md-dialog aria-label="Turnos" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-warning">
                                    <h5 class="modal-title">Turnos</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <p>
                                      Esta seguro que desea cancelar el turno ${turno.ID}?
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
                parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
                locals: { TurnoID: turno.ID }
            })
                .then(answer => {
                    let url = "Turno/Cancelar";
                    let params = {};
                    params.model = turno;
                    let promise = crudService.PutHttp(url, params);
                    success(promise);
                })
                .catch(() => undefined);


        };

        $this.cancelarSesiones = (turno, success, parentEl) => {
            let modalHtml = `<md-dialog aria-label="Turnos" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-warning">
                                    <h5 class="modal-title">Turnos</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <p>
                                      Esta seguro que desea cancelar las sesiones seleccionadas?
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
                parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
                locals: { TurnoID: turno.ID }
            })
                .then(answer => {
                    let url = "Sesion/Cancelar";
                    let sesiones = turno.Sesions.filter(s => s.selected);

                    let params = {};
                    params.model = sesiones;
                    let promise = crudService.PutHttp(url, params);
                    success(promise);
                })
                .catch(() => undefined);


        };

        $this.sendTurno = (turnoId) => {
            let params = {};
            params.turnoId = turnoId;
            return crudService.PostHttp("turno/enviar", params);
            //return crudService.GetPHttp("api/turno/enviar/" + turnoId);
        };

        $this.confirmarTurno = (turno, continuar, turnoID) => {
            let params = {};
            let url = "Turno/Confirmar";
            params.model = turno;
            params.continuar = continuar;
            params.turnoID = turnoID;
            let promise = crudService.PutHttp(url, params);
            return promise;
        };

        $this.openCambiarSesionModal = (sesion, success, parentEl) => {
            let modalHtml = `<md-dialog aria-label="Paciente" md-draggable>
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
                //parent: angular.element(document.body),//parent: parentEl,
                parent: angular.element(document.body),//parent: angular.element(document.body),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true
                //,
                //locals: { turno: turno }
            })
                .then(answer => {
                    success(answer);
                })
                .catch(() => { });
        };

        $this.posponerSesiones = (sesiones, fecha) => {
            let params = {};
            let url = "Sesion/Posponer";
            params.model = sesiones;
            params.fecha = fecha;
            let promise = crudService.PutHttp(url, params);
            return promise;
        };

        $this.openPosponerSesionModal = (turno, success, parentEl) => {
            let modalHtml = `<md-dialog aria-label="Paciente" md-draggable>
                                <md-toolbar>
                                    <div class="md-toolbar-tools  badge-warning">
                                        <h5 class="modal-title">Posponer Turno</h5>
                                    </div>
                                </md-toolbar>
                                <sesion-posponer turno="turno" on-save="answer" on-cancel="cancel" />
                            </md-dialog>`;

            function DialogController($scope, $mdDialog) {
                $scope.turno = turno;
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
                parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                multiple: true,
                fullscreen: false
                //,
                //locals: { turno: turno }
            })
                .then(answer => {

                    success(answer);
                })
                .catch(() => undefined);
        };

        
        $this.openNumeroAutorizacion = (turno, success, parentEl) => {

            let modalHtml = `<md-dialog aria-label="Turnos" class="w-50" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-primary">
                                    <h5 class="modal-title">Turno ${turno.ID} - Número Autorización</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <md-input-container class="md-block">
                                        <label>Código Transacción</label>
                                            <input ng-model="turno.NumeroAutorizacion" maxlength="50" md-maxlength="50" md-select-on-focus"></input>
                                    </md-input-container>                                                                              
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>
                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cerrar</md-button>
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(turno)'><span class='icon-save'></span> Guardar</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;
            function DialogController($scope, $mdDialog) {

                let init = () => {
                    $scope.turno = turno;
                };

                init();

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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                //parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
                locals: { turno: turno }
            })
                .then(answer => {
                    //[Route("Turno/{id}/NumeroAutorizacion")]
        //public JsonResult ModificarTurnoNumeroAutorizacion(int id, string numero)

                    turno.NumeroAutorizacion = answer.NumeroAutorizacion;
                    let url = `Turno/${turno.ID}/NumeroAutorizacion`;
                    const params = {                        
                        numero: turno.NumeroAutorizacion
                    };
                    let promise = crudService.PutHttp(url, params);
                    success(promise);
                })
                .catch(() => undefined);
        };

        $this.openCodigoTransaccion = (sesion, success, parentEl) => {
            
            let modalHtml = `<md-dialog aria-label="Turnos" class="w-50" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-primary">
                                    <h5 class="modal-title">Sesion ${sesion.Numero} - Código Transacción</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">        
                                    <md-input-container class="md-block">
                                        <label>Código Transacción</label>
                                            <input ng-model="sesion.CodigoTransaccion" maxlength="50" md-maxlength="50" md-select-on-focus"></input>
                                    </md-input-container>                                                                              
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>
                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cerrar</md-button>
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(sesion)'><span class='icon-save'></span> Guardar</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;
            function DialogController($scope, $mdDialog) {

                let init = () => {
                    $scope.sesion = sesion;                                        
                };

                init();

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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                //parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
                locals: { sesion: sesion }
            })
                .then(answer => {

                    
                    sesion.CodigoTransaccion = answer.CodigoTransaccion;                    
                    let url = 'Sesion/CodigoTransaccion';
                    const params = {
                        id: sesion.ID,
                        codigo: sesion.CodigoTransaccion
                    };
                    let promise = crudService.PutHttp(url, params);                    
                    success(promise);
                })
                .catch(() => undefined);
        };

        $this.openDiagnostico = (paciente, turno, success, parentEl) => {            
            let modalHtml = `<md-dialog aria-label="Turnos" class="w-50" md-draggable>
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
                                            <textarea ng-model="diagnostico.diagnostico" maxlength="150" md-maxlength="150" rows="3" md-select-on-focus"></textarea>
                                    </md-input-container>        

                                    <md-input-container class="md-block">
                                                <label>
                                                    Tipo Sesion
                                                </label>
                                                <md-select ng-model="diagnostico.tiposesionid" required>
                                                    <md-option ng-repeat="item in tipos" ng-value="{{item.Value}}">{{item.Text}}</md-option>
                                                </md-select>                                                
                                            </md-input-container>

                                    <div ng-show="codigos.length>0">
                                        <label>Código de Práctica:</label>
                                        <md-radio-group ng-model="diagnostico.codigopractica" class="md-primary">
                                          <md-radio-button ng-repeat="cod in codigos" ng-value="cod" >{{cod}}</md-radio-button>                                      
                                        </md-radio-group>
                                    </div>
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

                let init = () => {
                    $scope.diagnostico = {};
                    $scope.codigos = [];
                    $scope.diagnostico.diagnostico = turno.Diagnostico;
                    $scope.tipos = [{ Value: 1, Text: "RPG" }, { Value: 2, Text: "FKT" }, { Value: 3, Text: "GYM" }];
                    //$scope.diagnostico.codigopractica = turno.CodigoPractica;
                    switch (paciente.AseguradoraID) {
                        case 1:
                            $scope.codigos = ['25.01.81', '25.01.64'];
                            break;
                        case 22:
                            $scope.codigos = ['90.25.22', '25.80.01', '90.25.38'];
                            break;
                    }
                    $scope.diagnostico.codigopractica = turno.CodigoPractica;
                    $scope.diagnostico.tiposesionid = turno.TipoSesionID ? turno.TipoSesionID : turno.Tipo;                    
                };

                init();

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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                //parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
                locals: { turno: turno }
            })
                .then(answer => {
                    turno.Diagnostico = answer.diagnostico;
                    turno.CodigoPractica = answer.codigopractica;
                    turno.TipoSesionID = answer.tiposesionid;
                    let url = "Turno/Diagnostico";
                    let promise = crudService.PutHttp(url, turno);
                    success(promise);
                })
                .catch(() => undefined);
        };


        $this.openDobleOrden = (turno, success, parentEl) => {
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
                parent: angular.element(document.body),//parent: parentEl.children(),
                templateUrl: Domain + 'Turno/DobleOrden',
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
                locals: { turno: turno }
            })
                .then(answer => {
                    let params = {};
                    params.model = turno;
                    params.turnoID = answer ? 1 : 0;
                    let url = "Turno/SetDobleOrden";
                    let promise = crudService.PutHttp(url, params);
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



        $this.openSelectTurnoContinuar = (turno, success, parentEl) => {
            let modalHtml = `<md-dialog aria-label="Turnos" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-primary">
                                    <h5 class="modal-title">Turno</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">                                                                                                                                                                                                                            
                                        <md-input-container class="form-group md-block">                                          
                                          <label>Continuar con sesiones anteriores?</label> 
                                          <md-select ng-model="turnoID"> 
                                            
                                            <md-option ng-repeat="t in turnos" ng-value="t.ID">
                                              <span ng-if="t.ID">
                                              Turno {{t.ID}} ({{t.CantidadSesiones}}): {{t.FechaDesde | date : 'dd-MM-yy'}} a {{t.FechaHasta | date : 'dd-MM-yy'}}
                                              </span>
                                              <span ng-hide="t.ID">
                                              ------------------NO------------------
                                              </span>
                                            </md-option>
                                          </md-select>
                                        </md-input-container>
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>                                  
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(turnoID)'><span class='icon-ok'></span> Aceptar</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;

            function DialogController($scope, $mdDialog) {
                //$scope.Turnos = [];
                //$scope.turno = {};                

                let loadTurnos = (id) => {
                    let url = "Paciente/ListarTurnosContinuar/" + id;
                    
                    let promise = crudService.GetPHttpParse(url);
                    promise.then(data => {                        
                        $scope.turnos = data.filter(t => !(t.ID === turno.ID));
                        $scope.turnos.unshift({ ID: null, FechaDesde: null, FechaHasta: null });
                        //$scope.turnoID = $scope.turnos[0].ID;
                    });
                };

                let init = () => {                    
                    $scope.turnos = [];
                    $scope.turnoID = null;                    
                    loadTurnos(turno.PacienteID);
                };

                init();

               

                $scope.hide = function () {
                    //$mdDialog.hide();
                };
                $scope.cancel = function () {
                    //$mdDialog.hide();
                };
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            $mdDialog.show({
                parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true
            })
                .then(answer => {
                    success(answer?true:false, answer);
                })
                .catch(() => success(false));
        };

        //se reempleazo por openSelectTurnosContinuar
        $this.openContinuarSesiones = (success, parentEl) => {
            let modalHtml = `<md-dialog aria-label="Turnos" md-draggable>
                              <form ng-cloak>
                                <md-toolbar>
                                  <div class="md-toolbar-tools  badge-primary">
                                    <h5 class="modal-title">Turno</h5>        
                                  </div>
                                </md-toolbar>
                                <md-dialog-content>
                                  <div class="md-dialog-content">                                            
                                        <label>Continuar con sesiones anteriores?</label>                                                                                
                                  </div>
                                </md-dialog-content>

                                <md-dialog-actions layout="row">      
                                  <span flex></span>
                                  <md-button type='button' class='md-raised md-warn' ng-click='answer(false)'><i class='icon-cancel'></i> NO</md-button>
                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> SI</md-button>
                                </md-dialog-actions>
                              </form>
                             </md-dialog>`;

            function DialogController($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide(false);
                };
                $scope.cancel = function () {
                    $mdDialog.hide(false);
                };
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            $mdDialog.show({
                parent: angular.element(document.body),//parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true
            })
                .then(answer => {
                    success(answer);
                })
                .catch(() => success(false));
        };

        let getNumeroSesionWp = (numero) => {
            let resu = numero.toString();
            resu = numero < 10 ? '0' + numero.toString() : numero.toString();

            return resu;
        };

        $this.linkWhatsapp = (turno, paciente) => {
            //pdfService.CreateTurnoPdf($window.document.querySelector('#div' + fecha).innerHTML);       
            let body = [];
            let estadosImprimible = [1, 2, 4, 5];
            turno.Sesions.forEach(sesion => {

                if (estadosImprimible.includes(sesion.Estado)) {
                    let row = `${getNumeroSesionWp(sesion.Numero)}%20%20%20%20%09${$this.toShortDate(moment(sesion.FechaHora).toDate())}%20%20%20%20%09${$this.toHour(sesion.FechaHora)}%0A`;
                    row = convertirCaracteresFecha(row);
                    body.push(row);
                    //body.push('~----------------------------------~%0A');
                }
            });
            //body.push('%0A%0A*%C2%B7*Chacabuco 193 3C*');
            body.push('%0A%0A*%C2%B7* _En caso de ausencia con aviso previo de 24hs, se reprogramarán *SÓLO* dos sesiones de las asignadas._');
            body.push('%0A*%C2%B7* _La ausencia sin previo aviso se computará la sesión._');
            body.push('%0A*%C2%B7* _Ante la segunda ausencia sin aviso, se cancelarán *TODOS* los turnos subsiguiente_');

            //body.unshift('%23%23%23*%09*Fecha%20%20%20%20%20*%09*Hora*%0A');
            body.unshift(`Diagnóstico: ${turno.Diagnostico ? turno.Diagnostico : ''}%0A`);
            body.unshift(`${paciente.Apellido} ${paciente.Nombre} (DNI${paciente.DocumentoNumero})%0A`);
            body.unshift('%0AAsistir sin acompañantes.%0A%0A');
            body.unshift('%0AEl tapaboca es de uso *OBLIGATORIO*.');
            body.unshift('%0AAl ingresar al consultorio lavarse las manos y secarse con su propia toalla que deberá traer.');
            body.unshift('%0A%0AActuemos con conciencia y de manera responsable, si tiene síntomas compatibles con Covid-19 por favor *NO ASISTIR*.');
            body.unshift(`*Turnos de kinesiología. Licenciada Elvira Y.  De Lorenzo MN 14.957*%0A*Chacabuco 194 3°C*`);
            
            //let wLink = `https://api.whatsapp.com/send?phone=54${paciente.Celular}&text=`;
            let wLink = `https://wa.me/${paciente.Celular}?text=`;
            body.forEach(linea => wLink += linea);
            return wLink;
        };

        let convertirCaracteresFecha = (linea) => {

            linea = linea.replace('/', '%2F');
            linea = linea.replace('/', '%2F');
            linea = linea.replace(':', '%3A');
            linea = linea.replace(' ', '%20');
            return linea;
        };

        $this.getTipoSesion = idSesion => {
            let resu;
            switch (idSesion) {
                case 1:
                    resu = 'RPG';
                    break;
                case 2:
                    resu = 'FKT';
                    break;
                case 3:
                    resu = 'GYM';
                    break;
                default:
                    resu = '';
                    break;
            }
            return resu;
        };

        $this.existTurnosAnteriores = (pacienteID, tipoID) => {
            tipoID = tipoID || 0;
            return crudService.GetPHttp(`Paciente/${pacienteID}/Tipo/${tipoID}/TurnosAnteriores`);
        };

        $this.IsTurnoSuperpuesto = (turnoID) => {
            return crudService.GetPHttp(`Paciente/Turno/${turnoID}/IsSuperpuesto`);
        };

        $this.IsSesionSuperpuesta = (sesionID, fechaHoraSesion) => {
            let data = {
                ID: sesionID,
                fechaHoraSesion: fechaHoraSesion
            };
            return crudService.PostHttp(`Paciente/Sesion/IsSuperpuesto`, data);
        };

        $this.IsTurnoSuperpuestoPaciente = (turno) => {            
            return crudService.PostHttp(`Paciente/Turno/IsSuperpuesto`, turno);
        };

        $this.Notify = (title, message, parentEl) => {
            return $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog')
                    .ok('Aceptar')
                    .multiple(true)
            );
        };

        $this.FacturacionTurnoShow = (turno, success, parentEl) => {                        
            function DialogController($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.hide();
                };
                $scope.answer = function () {
                    $mdDialog.hide();
                };
            }
            $mdDialog.show({
                parent: angular.element(document.body),//parent: parentEl,
                templateUrl: `${Domain}Turno/${turno.ID}/Facturacion?v=${Math.floor(Math.random() * 100 + 1)}`,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                multiple: true,
                fullscreen: false               
            });
                //.then(answer => {
                //    success();
                //})
                //.catch(() => success());


        };

        $this.viewFile = (fileId, parentEl) => {
                        
            viewFileModal(fileId, parentEl);
        };

        function viewFileModal (file, parentEl) {

            let modalHtml = 
            `               <md-dialog aria-label="Paciente" md-draggable>
                                <md-toolbar>
                                    <div class="modal-header badge-info">
                                        <h4 class="modal-title text-capitalize"><span class="icon-file-pdf badge-info">Visor Archivos</span></h4>
                                        <button type="button" ng-click="cancel()" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    
                                </md-toolbar>
                                <view-file file-id='${file}' style="width:${window.innerWidth * .8}px;height:${window.innerHeight * .80}px; "></view-file>
                            </md-dialog>                                        
                                  `;            
            function DialogController($scope, $mdDialog) {
                $scope.file = file;
                $scope.hide = function () {
                    $mdDialog.hide(false);
                };
                $scope.cancel = function () {
                    $mdDialog.hide(false);
                };
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            $mdDialog.show({
                //parent: angular.element(document.body),//parent: parentEl,
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true
            });
        }

        function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    }
}
)();