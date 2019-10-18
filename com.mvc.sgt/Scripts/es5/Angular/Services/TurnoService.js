(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("turnoService", ['crudService', 'pdfService', '$mdDialog', turnoServiceController]);
    function turnoServiceController(crudService, pdfService, $mdDialog) {
        var $this = this;
        $this.toDate = function (value) {
            var dateValue = moment(value).toDate();
            return angular.isDate(dateValue) ? $this.getDayName(dateValue) + ' ' + $this.toShortDate(dateValue) : '';
        };
        $this.getDayName = function (value) {
            var weekday = new Array(7);
            weekday[0] = "Domingo";
            weekday[1] = "Lunes";
            weekday[2] = "Martes";
            weekday[3] = "Miércoles";
            weekday[4] = "Jueves";
            weekday[5] = "Viernes";
            weekday[6] = "Sábado";
            return weekday[value.getDay()];
        };
        $this.toShortDate = function (value) {
            var sDia = $this.addZero(value.getDate());
            var sMes = $this.addZero(value.getMonth() + 1);
            var sAnio = value.getFullYear();
            var sFecha = sDia + "/" + sMes + "/" + sAnio;
            return sFecha;
        };
        $this.addZero = function (i) {
            return i < 10 ? '0' + i : i;
        };
        $this.toHourRange = function (value, sesiones) { return $this.toHour(value) + ' a ' + $this.nextHour(value, sesiones); };
        $this.toHour = function (value) {
            var dateValue = moment(value).toDate();
            return angular.isDate(dateValue) ? $this.addZero(dateValue.getHours()) + ':' + $this.addZero(dateValue.getMinutes()) : '';
        };
        $this.nextHour = function (value, sesiones) {
            var dateValue = moment(value).toDate();
            if (angular.isDate(dateValue))
                dateValue.setMinutes(dateValue.getMinutes() + 30 * sesiones);
            return angular.isDate(dateValue) ? $this.addZero(dateValue.getHours()) + ':' + $this.addZero(dateValue.getMinutes()) : '';
        };
        $this.turnoPrint = function (turno, paciente) {
            var body = [];
            var estadosImprimible = [1, 2, 4, 5];
            turno.Sesions.forEach(function (sesion) {
                var row = [];
                if (estadosImprimible.includes(sesion.Estado)) {
                    row.push(sesion.Numero.toString());
                    row.push($this.toDate(sesion.FechaHora));
                    row.push($this.toHour(sesion.FechaHora));
                    body.push(row);
                }
            });
            body.unshift(['#', 'Fecha', 'Horario']);
            var headerText = "Turno: " + turno.ID + " - " + paciente.Apellido + ", " + paciente.Nombre;
            pdfService.CreateTurnoPdf(body, headerText);
        };
        $this.bolder = function (estado) {
            if (estado < 9 && estado != 6) {
                return true;
            }
            else {
                return false;
            }
        };
        $this.getEstados = function () { return crudService.GetPHttp("api/grilla/Estados"); };
        $this.getConsultorios = function () { return crudService.GetPHttp("api/grilla/Consultorios"); };
        $this.getConsultoriosFecha = function (fechaConsultorio) { return crudService.GetPHttp("Consultorio/ListarHorarios/" + fechaConsultorio.getFullYear() + "/" + (fechaConsultorio.getMonth() + 1) + "/" + fechaConsultorio.getDate()); };
        $this.getNombreEstado = function (idEstado, Estados) { return Estados.find(function (estado) { return estado.ID === idEstado; }).Descripcion; };
        $this.getNombreConsultorio = function (idConsultorio, Consultorios) { return Consultorios.find(function (consultorio) { return consultorio.ID === idConsultorio; }).Descripcion; };
        $this.getColorConsultorio = function (idConsultorio, Consultorios) { return Consultorios.find(function (consultorio) { return consultorio.ID === idConsultorio; }).Color; };
        $this.getTurno = function (id) { return crudService.GetPHttp("Turno/" + id); };
        $this.getSesion = function (id) { return crudService.GetPHttp("api/sesiones/" + id); };
        $this.getTurnosPaciente = function (id) { return crudService.GetPHttp("Paciente/ListTurnos/" + id); };
        $this.getPaciente = function (id) { return crudService.GetPHttp("Paciente/Get/" + id); };
        $this.turnosSesionesOrder = function (data) {
            data.forEach(function (turno) {
                turno = $this.sesionesOrder(turno);
                var fechaActual = new Date();
                turno.end = turno.Sesions[turno.Sesions.length - 1].FechaHora;
                var pos = 0;
                turno.begin = turno.Sesions[pos].FechaHora;
                if (fechaActual.getTime() >= moment(turno.begin).toDate().getTime() && fechaActual.getTime() <= moment(turno.end).toDate().getTime())
                    turno.visible = true;
                else
                    turno.visible = false;
            });
            return data;
        };
        $this.sesionesOrder = function (data) {
            var sesiones = JSON.parse(JSON.stringify(data.Sesions.filter(function (value, index, self) {
                return self.findIndex(function (element) { return element.Numero === value.Numero
                    && $this.toShortDate(moment(element.FechaHora).toDate()) == $this.toShortDate(moment(value.FechaHora).toDate())
                    && value.FechaModificacion == element.FechaModificacion
                    && element.Estado === value.Estado && element.ConsultorioID === value.ConsultorioID
                    && element.TurnoSimultaneo === value.TurnoSimultaneo; })
                    === index;
            })));
            sesiones.forEach(function (mValue) {
                var result = data.Sesions.filter(function (fValue) {
                    return mValue.Numero === fValue.Numero &&
                        $this.toShortDate(moment(mValue.FechaHora).toDate()) == $this.toShortDate(moment(fValue.FechaHora).toDate())
                        && fValue.FechaModificacion == mValue.FechaModificacion
                        && mValue.Estado === fValue.Estado && mValue.ConsultorioID === fValue.ConsultorioID
                        && mValue.TurnoSimultaneo === fValue.TurnoSimultaneo;
                }).length;
                mValue.sesiones = result;
            });
            console.dir(sesiones);
            data.Sesions = sesiones.sort(function (a, b) { return a.Numero - b.Numero; });
            return data;
        };
        $this.sesionAnular = function (sesionID, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-warning\">\n                                    <h5 class=\"modal-title\">Turnos</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">        \n                                    <p>\n                                      Esta seguro que desea eliminar la sesion?\n                                    </p>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> Aceptar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
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
                parent: parentEl,
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { TurnoID: TurnoID }
            })
                .then(function (answer) {
                var url = "Sesion/Estado/Anular";
                var params = {};
                params.id = sesionID;
                var promise = crudService.PutHttp(url, params);
                promise.then(function () { return success(); });
            })
                .catch(function () { return undefined; });
        };
        $this.getTurnosSinFechaAsignada = function () { return crudService.GetPHttp('api/turno/SinFechaAsignada'); };
        $this.asignarPaciente = function (turno) {
            var url = "Turno/AsignarPaciente";
            var promise = crudService.PutHttp(url, turno);
            return promise;
        };
        $this.AgregarSesionesTurno = function (turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-warning\">\n                                    <h5 class=\"modal-title\">Agregar Sesiones</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">                                                                                    \n                                        <div class=\"form-group\">\n                                            <label >Sesiones\n                                                <input type=\"number\" class=\"form-control\" ng-model=\"cantidad\" placeholder=\"\" min=\"1\">\n                                            </label>\n                                          </div>\n                                          <div class=\"form-check\">\n                                            <input type=\"checkbox\" class=\"form-check-input\" id=\"chkAgregarDias\" ng-model=\"continuar\">\n                                            <label class=\"form-check-label\" for=\"chkAgregarDias\">Continuar sesiones anteriores.</label>\n                                          </div>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer()'><span class='icon-ok'></span> Aceptar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(function (answer) {
                var url = "Turno/AgregarSesiones";
                var params = {};
                params.model = turno;
                params.sesiones = answer.cantidad;
                params.continuar = answer.continuar;
                var promise = crudService.PutHttp(url, params);
                success(promise);
            })
                .catch(function () { return undefined; });
        };
        $this.cancelarTurno = function (turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-warning\">\n                                    <h5 class=\"modal-title\">Turnos</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">        \n                                    <p>\n                                      Esta seguro que desea cancelar el turno " + turno.ID + "?\n                                    </p>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> Aceptar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { TurnoID: TurnoID }
            })
                .then(function (answer) {
                var url = "Turno/Cancelar";
                var params = {};
                params.model = turno;
                var promise = crudService.PutHttp(url, params);
                success(promise);
            })
                .catch(function () { return undefined; });
        };
        $this.cancelarSesiones = function (turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-warning\">\n                                    <h5 class=\"modal-title\">Turnos</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">        \n                                    <p>\n                                      Esta seguro que desea cancelar las sesiones seleccionadas?\n                                    </p>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> Aceptar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { TurnoID: TurnoID }
            })
                .then(function (answer) {
                var url = "Sesion/Cancelar";
                var sesiones = turno.Sesions.filter(function (s) { return s.selected; });
                var params = {};
                params.model = sesiones;
                var promise = crudService.PutHttp(url, params);
                success(promise);
            })
                .catch(function () { return undefined; });
        };
        $this.sendTurno = function (turnoId) {
            var params = {};
            params.turnoId = turnoId;
            return crudService.PostHttp("turno/enviar", params);
        };
        $this.confirmarTurno = function (turno, continuar, turnoID) {
            var params = {};
            var url = "Turno/Confirmar";
            params.model = turno;
            params.continuar = continuar;
            params.turnoID = turnoID;
            var promise = crudService.PutHttp(url, params);
            return promise;
        };
        $this.openCambiarSesionModal = function (sesion, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Paciente\">\n                                <md-toolbar>\n                                    <div class=\"md-toolbar-tools  badge-warning\">\n                                        <h5 class=\"modal-title\">Cambiar Turno</h5>\n                                    </div>\n                                </md-toolbar>\n                                <sesion-edit-modal sesion=\"sesion\" on-save=\"answer\" on-cancel=\"cancel\" />\n                            </md-dialog>";
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
                parent: parentEl,
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false
            })
                .then(function (answer) {
                success(answer);
            })
                .catch(function () { });
        };
        $this.posponerSesiones = function (sesiones, fecha) {
            var params = {};
            var url = "Sesion/Posponer";
            params.model = sesiones;
            params.fecha = fecha;
            var promise = crudService.PutHttp(url, params);
            return promise;
        };
        $this.openPosponerSesionModal = function (turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Paciente\">\n                                <md-toolbar>\n                                    <div class=\"md-toolbar-tools  badge-warning\">\n                                        <h5 class=\"modal-title\">Posponer Turno</h5>\n                                    </div>\n                                </md-toolbar>\n                                <sesion-posponer turno=\"turno\" on-save=\"answer\" on-cancel=\"cancel\" />\n                            </md-dialog>";
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false
            })
                .then(function (answer) {
                success(answer);
            })
                .catch(function () { return undefined; });
        };
        $this.openDiagnostico = function (paciente, turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\" class=\"w-50\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-primary\">\n                                    <h5 class=\"modal-title\">Turno - Diagn\u00F3stico</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">        \n                                    <md-input-container class=\"md-block\">\n                                        <label>Diagn\u00F3stico</label>\n                                            <textarea ng-model=\"diagnostico.diagnostico\" maxlength=\"150\" md-maxlength=\"150\" rows=\"3\" md-select-on-focus\"></textarea>\n                                    </md-input-container>        \n\n                                    <md-input-container class=\"md-block\">\n                                                <label>\n                                                    Tipo Sesion\n                                                </label>\n                                                <md-select ng-model=\"diagnostico.tiposesionid\" required>\n                                                    <md-option ng-repeat=\"item in tipos\" ng-value=\"{{item.Value}}\">{{item.Text}}</md-option>\n                                                </md-select>                                                \n                                            </md-input-container>\n\n                                    <div ng-show=\"codigos.length>0\">\n                                        <label>C\u00F3digo de Pr\u00E1ctica:</label>\n                                        <md-radio-group ng-model=\"diagnostico.codigopractica\" class=\"md-primary\">\n                                          <md-radio-button ng-repeat=\"cod in codigos\" ng-value=\"cod\" >{{cod}}</md-radio-button>                                      \n                                        </md-radio-group>\n                                    </div>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cerrar</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(diagnostico)'><span class='icon-save'></span> Guardar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
            function DialogController($scope, $mdDialog) {
                var init = function () {
                    $scope.diagnostico = {};
                    $scope.codigos = [];
                    $scope.diagnostico.diagnostico = turno.Diagnostico;
                    $scope.tipos = [{ Value: 1, Text: "RPG" }, { Value: 2, Text: "FKT" }, { Value: 3, Text: "GYM" }];
                    switch (paciente.AseguradoraID) {
                        case 1:
                            $scope.codigos = ['25.01.81', '25.01.64'];
                            break;
                        case 22:
                            $scope.codigos = ['90.25.22', '25.80.01'];
                            break;
                    }
                    $scope.diagnostico.codigopractica = turno.CodigoPractica;
                    $scope.diagnostico.tiposesionid = turno.TipoSesionID;
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(function (answer) {
                turno.Diagnostico = answer.diagnostico;
                turno.CodigoPractica = answer.codigopractica;
                turno.TipoSesionID = answer.tiposesionid;
                var url = "Turno/Diagnostico";
                var promise = crudService.PutHttp(url, turno);
                success(promise);
            })
                .catch(function () { return undefined; });
        };
        $this.openDobleOrden = function (turno, success, parentEl) {
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
                parent: parentEl.children(),
                templateUrl: Domain + 'Turno/DobleOrden',
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(function (answer) {
                var params = {};
                params.model = turno;
                params.turnoID = answer ? 1 : 0;
                var url = "Turno/SetDobleOrden";
                var promise = crudService.PutHttp(url, params);
                success(promise);
            })
                .catch(function () { return undefined; });
        };
        $this.setEstadoAsistio = function (sesionsID) {
            var url = "Sesion/Estados/Asistio";
            var params = {};
            params.ids = sesionsID;
            var promise = crudService.PutHttp(url, params);
            return promise;
        };
        $this.setEstadoNoAsistio = function (sesionsID) {
            var url = "Sesion/Estados/NoAsistio";
            var params = {};
            params.ids = sesionsID;
            var promise = crudService.PutHttp(url, params);
            return promise;
        };
        $this.openSelectTurnoContinuar = function (turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-primary\">\n                                    <h5 class=\"modal-title\">Turno</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">                                                                                                                                                                                                                            \n                                        <md-input-container class=\"form-group md-block\">                                          \n                                          <label>Continuar con sesiones anteriores?</label> \n                                          <md-select ng-model=\"turnoID\"> \n                                            \n                                            <md-option ng-repeat=\"t in turnos\" ng-value=\"t.ID\">\n                                              <span ng-if=\"t.ID\">\n                                              Turno {{t.ID}} : {{t.FechaDesde | date : 'dd-MM-yy'}} a {{t.FechaHasta | date : 'dd-MM-yy'}}\n                                              </span>\n                                              <span ng-hide=\"t.ID\">\n                                              ------------------NO------------------\n                                              </span>\n                                            </md-option>\n                                          </md-select>\n                                        </md-input-container>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>                                  \n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(turnoID)'><span class='icon-ok'></span> Aceptar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
            function DialogController($scope, $mdDialog) {
                var loadTurnos = function (id) {
                    var url = "Paciente/ListarTurnosContinuar/" + id;
                    var promise = crudService.GetPHttpParse(url);
                    promise.then(function (data) {
                        $scope.turnos = data.filter(function (t) { return !(t.ID === turno.ID); });
                        $scope.turnos.unshift({ ID: null, FechaDesde: null, FechaHasta: null });
                    });
                };
                var init = function () {
                    $scope.turnos = [];
                    $scope.turnoID = null;
                    loadTurnos(turno.PacienteID);
                };
                init();
                $scope.hide = function () {
                };
                $scope.cancel = function () {
                };
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }
            $mdDialog.show({
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true
            })
                .then(function (answer) {
                success(answer ? true : false, answer);
            })
                .catch(function () { return success(false); });
        };
        $this.openContinuarSesiones = function (success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-primary\">\n                                    <h5 class=\"modal-title\">Turno</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">                                            \n                                        <label>Continuar con sesiones anteriores?</label>                                                                                \n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='answer(false)'><i class='icon-cancel'></i> NO</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> SI</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                multiple: true
            })
                .then(function (answer) {
                success(answer);
            })
                .catch(function () { return success(false); });
        };
        var getNumeroSesionWp = function (numero) {
            var resu = numero.toString();
            resu = numero < 10 ? '0' + numero.toString() : numero.toString();
            return resu;
        };
        $this.linkWhatsapp = function (turno, paciente) {
            var body = [];
            var estadosImprimible = [1, 2, 4, 5];
            turno.Sesions.forEach(function (sesion) {
                if (estadosImprimible.includes(sesion.Estado)) {
                    var row = getNumeroSesionWp(sesion.Numero) + "%20%20%20%20%09" + $this.toShortDate(moment(sesion.FechaHora).toDate()) + "%20%20%20%20%09" + $this.toHour(sesion.FechaHora) + "%0A";
                    row = convertirCaracteresFecha(row);
                    body.push(row);
                }
            });
            body.push('%0A%0A*%C2%B7* _En caso de ausencia con aviso previo de 24hs, se reprogramarán *SÓLO* dos sesiones de las asignadas._');
            body.push('%0A*%C2%B7* _La ausencia sin previo aviso se computará la sesión._');
            body.push('%0A*%C2%B7* _Ante la segunda ausencia sin aviso, se cancelarán *TODOS* los turnos subsiguiente_');
            body.unshift("*Turno%20kinesiolog\u00EDa%3A*%0A%0A");
            var wLink = "https://wa.me/54" + paciente.Celular + "?text=";
            body.forEach(function (linea) { return wLink += linea; });
            return wLink;
        };
        var convertirCaracteresFecha = function (linea) {
            linea = linea.replace('/', '%2F');
            linea = linea.replace('/', '%2F');
            linea = linea.replace(':', '%3A');
            linea = linea.replace(' ', '%20');
            return linea;
        };
        $this.getTipoSesion = function (idSesion) {
            var resu;
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
        $this.existTurnosAnteriores = function (pacienteID, tipoID) {
            tipoID = tipoID || 0;
            return crudService.GetPHttp("Paciente/" + pacienteID + "/Tipo/" + tipoID + "/TurnosAnteriores");
        };
        $this.IsTurnoSuperpuesto = function (turnoID) {
            return crudService.GetPHttp("Paciente/Turno/" + turnoID + "/IsSuperpuesto");
        };
        $this.Notify = function (title, message, parentEl) {
            return $mdDialog.show($mdDialog.alert()
                .parent(parentEl.children())
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ariaLabel('Alert Dialog')
                .ok('Aceptar')
                .multiple(true));
        };
        $this.FacturacionTurnoShow = function (turno, success, parentEl) {
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
                parent: parentEl,
                templateUrl: Domain + "Turno/" + turno.ID + "/Facturacion?v=" + Math.floor(Math.random() * 100 + 1),
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false
            });
        };
    }
})();
//# sourceMappingURL=TurnoService.js.map