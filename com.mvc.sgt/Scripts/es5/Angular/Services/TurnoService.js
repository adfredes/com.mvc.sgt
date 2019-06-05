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
        $this.turnoPrint = function (turno, paciente, Consultorios, Estados) {
            var body = [];
            var estadosImprimible = [1, 2, 4, 5];
            turno.Sesions.forEach(function (sesion) {
                var row = [];
                if (estadosImprimible.includes(sesion.Estado)) {
                    row.push(sesion.Numero.toString());
                    row.push($this.toDate(sesion.FechaHora));
                    row.push($this.toHourRange(sesion.FechaHora, sesion.sesiones));
                    row.push($this.getNombreConsultorio(sesion.ConsultorioID, Consultorios));
                    body.unshift(row);
                }
            });
            body.unshift(['Número', 'Fecha', 'Horario', 'Consultorio']);
            var headerText = "Turno: " + turno.ID + " - " + paciente.Apellido + ", " + paciente.Nombre;
            pdfService.CreateTurnoPdf(body, headerText);
        };
        $this.getEstados = function () { return crudService.GetPHttp("api/grilla/Estados"); };
        $this.getConsultorios = function () { return crudService.GetPHttp("api/grilla/Consultorios"); };
        $this.getConsultoriosFecha = function (fechaConsultorio) { return crudService.GetPHttp("Consultorio/ListarHorarios/" + fechaConsultorio.getFullYear() + "/" + (fechaConsultorio.getMonth() + 1) + "/" + fechaConsultorio.getDate()); };
        $this.getNombreEstado = function (idEstado, Estados) { return Estados.find(function (estado) { return estado.ID === idEstado; }).Descripcion; };
        $this.getNombreConsultorio = function (idConsultorio, Consultorios) { return Consultorios.find(function (consultorio) { return consultorio.ID === idConsultorio; }).Descripcion; };
        $this.getTurno = function (id) { return crudService.GetPHttp("Turno/" + id); };
        $this.getSesion = function (id) { return crudService.GetPHttp("api/sesiones/" + id); };
        $this.getTurnosPaciente = function (id) { return crudService.GetPHttp("Paciente/ListTurnos/" + id); };
        $this.getPaciente = function (id) { return crudService.GetPHttp("Paciente/Get/" + id); };
        $this.turnosSesionesOrder = function (data) {
            data.forEach(function (turno) {
                turno = $this.sesionesOrder(turno);
                var fechaActual = new Date();
                if (fechaActual.getTime() <= moment(turno.Sesions[0].FechaHora).toDate().getTime() && fechaActual.getTime() >= moment(turno.Sesions[turno.Sesions.length - 1].FechaHora).toDate().getTime())
                    turno.visible = true;
                else
                    turno.visible = false;
                turno.begin = turno.Sesions[turno.Sesions.length - 1].FechaHora;
                turno.end = turno.Sesions[0].FechaHora;
            });
            return data;
        };
        $this.sesionesOrder = function (data) {
            var sesiones = JSON.parse(JSON.stringify(data.Sesions.filter(function (value, index, self) {
                return self.findIndex(function (element) { return element.Numero === value.Numero && element.ID < value.ID + 3
                    && element.Estado === value.Estado && element.ConsultorioID === value.ConsultorioID
                    && element.TurnoSimultaneo === value.TurnoSimultaneo; })
                    === index;
            })));
            sesiones.forEach(function (mValue) {
                var result = data.Sesions.filter(function (fValue) {
                    return mValue.ID + 3 > fValue.ID && mValue.Numero === fValue.Numero
                        && mValue.Estado === fValue.Estado && mValue.ConsultorioID === fValue.ConsultorioID
                        && mValue.TurnoSimultaneo === fValue.TurnoSimultaneo;
                }).length;
                mValue.sesiones = result;
            });
            data.Sesions = sesiones.sort(function (a, b) { return b.Numero - a.Numero; });
            return data;
        };
        $this.getTurnosSinFechaAsignada = function () { return crudService.GetPHttp('api/turno/SinFechaAsignada'); };
        $this.asignarPaciente = function (turno) {
            var url = "Turno/AsignarPaciente";
            var promise = crudService.PutHttp(url, turno);
            return promise;
        };
        $this.AgregarSesionesTurno = function (turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-warning\">\n                                    <h5 class=\"modal-title\">Agregar Sesiones</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">                                                                                    \n                                        <div class=\"form-group\">\n                                            <label >Sesiones\n                                                <input type=\"number\" class=\"form-control\" ng-model=\"cantidad\" placeholder=\"\">\n                                            </label>\n                                          </div>\n                                          <div class=\"form-check\">\n                                            <input type=\"checkbox\" class=\"form-check-input\" id=\"chkAgregarDias\" ng-model=\"continuar\">\n                                            <label class=\"form-check-label\" for=\"chkAgregarDias\">Continuar sesiones anteriores.</label>\n                                          </div>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer()'><span class='icon-ok'></span> Aceptar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
            function DialogController($scope, $mdDialog) {
                $scope.cantidad = 0;
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
        $this.sendTurno = function (turnoId) {
            var params = {};
            params.turnoId = turnoId;
            return crudService.PostHttp("turno/enviar", params);
        };
        $this.confirmarTurno = function (turno, continuar) {
            var params = {};
            var url = "Turno/Confirmar";
            params.model = turno;
            params.continuar = continuar;
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false
            })
                .then(function (answer) {
                success(answer);
            })
                .catch(function () { return success(undefined); });
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
                console.dir(answer);
                success(answer);
            })
                .catch(function () { return undefined; });
        };
        $this.openDiagnostico = function (turno, success, parentEl) {
            var modalHtml = "<md-dialog aria-label=\"Turnos\">\n                              <form ng-cloak>\n                                <md-toolbar>\n                                  <div class=\"md-toolbar-tools  badge-primary\">\n                                    <h5 class=\"modal-title\">Turno - Diagn\u00F3stico</h5>        \n                                  </div>\n                                </md-toolbar>\n                                <md-dialog-content>\n                                  <div class=\"md-dialog-content\">        \n                                    <md-input-container class=\"md-block\">\n                                        <label>Diagn\u00F3stico</label>\n                                            <textarea ng-model=\"diagnostico\" maxlength=\"150\" md-maxlength=\"150\" rows=\"3\" md-select-on-focus\" ng-init=\"" + turno.Diagnostico + "\"></textarea>\n                                    </md-input-container>\n                                  </div>\n                                </md-dialog-content>\n\n                                <md-dialog-actions layout=\"row\">      \n                                  <span flex></span>\n                                  <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cerrar</md-button>\n                                  <md-button type='button' class='md-raised md-primary' ng-click='answer(diagnostico)'><span class='icon-save'></span> Guardar</md-button>\n                                </md-dialog-actions>\n                              </form>\n                             </md-dialog>";
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
                parent: parentEl.children(),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: turno }
            })
                .then(function (answer) {
                turno.Diagnostico = answer;
                var url = "Turno/Diagnostico";
                var promise = crudService.PutHttp(url, turno);
                success(promise);
            })
                .catch(function () { return undefined; });
        };
        $this.openDobleOrden = function (turno, success, parentEl) {
            function DialogController($scope, $mdDialog) {
                $scope.turnoDoble = JSON.parse(JSON.stringify(turno.TurnoDoble));
                $scope.turnos = [];
                $scope.doble = JSON.parse(JSON.stringify(turno.TurnoDoble));
                var loadInit = function () {
                    crudService.GetPHttp("Turno/DobleOrden/" + turno.PacienteID)
                        .then(function (data) {
                        $scope.turnos = data.filter(function (t) { return t != turno.ID; });
                    })
                        .catch(function () { return $scope.turnos = []; });
                };
                loadInit();
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
                params.turnoID = answer;
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
    }
})();
//# sourceMappingURL=TurnoService.js.map