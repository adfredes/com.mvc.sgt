(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('pacienteTurnos', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/ViewTurnos',
        controller: ['turnoService', 'eventService', 'pdfService', 'crudService', '$window',
            '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog', '$element', pacienteTurnosController],
        bindings: {
            paciente: "<?",
            parent: "<?",
            onClose: "&?",
            onAdddiagnostico: "&?"
        }
    });
    sgtApp.component('datosSesiones', {
        templateUrl: Domain + 'Paciente/DatosSesiones',
        controller: ['turnoService', 'eventService', 'pdfService', 'crudService', '$window',
            '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog', '$element', datosSesionesController]
    });
    function pacienteTurnosController(turnoService, eventService, pdfService, crudService, $window, $mdSelect, $filter, $location, $route, $timeout, $mdDialog, $element) {
        var vm = this;
        vm.turnos = [];
        var Estados = [];
        var Consultorios = [];
        vm.selectedTurno = {};
        vm.deleteTurno = false;
        var parentModal;
        vm.getInformation = false;
        vm.reading = false;
        vm.toDate = function (value) {
            var dateValue = moment(value).toDate();
            return angular.isDate(dateValue) ? getDayName(dateValue) + ' ' + toShortDate(dateValue) : '';
        };
        var getDayName = function (value) {
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
        var toShortDate = function (value) {
            var sDia = addZero(value.getDate());
            var sMes = addZero(value.getMonth() + 1);
            var sAnio = value.getFullYear();
            var sFecha = sDia + "/" + sMes + "/" + sAnio;
            return sFecha;
        };
        var addZero = function (i) {
            return i < 10 ? '0' + i : i;
        };
        vm.toHourRange = function (value, sesiones) {
            return vm.toHour(value) + ' a ' + vm.nextHour(value, sesiones);
        };
        vm.toHour = function (value) {
            var dateValue = moment(value).toDate();
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };
        vm.nextHour = function (value, sesiones) {
            var dateValue = moment(value).toDate();
            if (angular.isDate(dateValue))
                dateValue.setMinutes(dateValue.getMinutes() + 30 * sesiones);
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };
        vm.getNombreEstado = function (idEstado) {
            return vm.Estados.find(function (estado) { return estado.ID === idEstado; }).Descripcion;
        };
        vm.getNombreConsultorio = function (idConsultorio) {
            return vm.Consultorios.find(function (consultorio) { return consultorio.ID === idConsultorio; }).Descripcion;
        };
        vm.getColorConsultorio = function (idConsultorio) { return turnoService.getColorConsultorio(idConsultorio, vm.Consultorios); };
        vm.turnoPrint = function (turno) {
            return turnoService.turnoPrint(turno, vm.paciente);
        };
        vm.sendTurnoWhatsapp = function (turno) {
            window.open(turnoService.linkWhatsapp(turno, vm.paciente));
        };
        vm.bolder = function (estado) { return turnoService.bolder(estado); };
        vm.sendTurno = function (turno) {
            turnoService.sendTurno(turno.ID)
                .then(function () { return undefined; })
                .catch(function () { return undefined; });
        };
        vm.sesionClick = function (fecha) {
            $window.sessionStorage.removeItem('FechaGrillaTurnos');
            $window.sessionStorage.removeItem('VistaGrillaTurnos');
            $window.sessionStorage.setItem('FechaGrillaTurnos', moment(fecha).toDate());
            $window.sessionStorage.setItem('VistaGrillaTurnos', 'd');
            if (vm.onClose) {
                vm.onClose();
            }
            $timeout(function () {
                if ($location.path() == '/Turnos') {
                    $route.reload();
                }
                else {
                    $location.path('/Turnos');
                }
            }, 500);
        };
        vm.cancelarSesionSelect = function (ev, turno) { return turnoService.cancelarTurno(turno, function (promise) {
            promise.then(function (data) {
                getTurnosPaciente(vm.paciente.ID);
                eventService.UpdateTurnos();
                if (vm.onChanges) {
                    vm.onChanges()();
                }
            });
        }, vm.parent.children()); };
        vm.confirmCancelarTurno = function () {
            vm.deleteTurno = false;
        };
        vm.getTipoSesion = function (idTipo) { return turnoService.getTipoSesion(idTipo); };
        var getEstados = function () {
            vm.reading = true;
            var promise = crudService.GetPHttp("api/grilla/Estados");
            promise.then(function (data) {
                vm.Estados = data;
                if (vm.paciente && vm.paciente.ID) {
                    getTurnosPaciente(vm.paciente.ID);
                }
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        var getConsultorios = function () {
            var promise = crudService.GetPHttp("api/grilla/Consultorios");
            promise.then(function (data) {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        var getTurnosPaciente = function (id) {
            vm.getInformation = true;
            console.log(vm.getInformation);
            var promise = crudService.GetPHttp("Paciente/ListTurnos/" + id);
            promise.then(function (data) {
                vm.reading = false;
                vm.turnos = sesionesOrder(JSON.parse(data));
                vm.getInformation = false;
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        var sesionesOrder = function (data) {
            return turnoService.turnosSesionesOrder(data);
        };
        vm.FacturacionTurnoShow = function (turno) {
            turnoService.FacturacionTurnoShow(turno, undefined, vm.parent);
        };
        var updateData = function () {
            eventService.UpdateTurnos();
            getTurnosPaciente(vm.paciente.ID);
        };
        vm.openCambiarSesionModal = function (sesion) { return turnoService.openCambiarSesionModal(sesion, updateData, vm.parent); };
        vm.sesionAnular = function (id) { return turnoService.sesionAnular(id, updateData, vm.parent); };
        vm.openDobleOrden = function (turno) {
            turnoService.openDobleOrden(turno, function (promise) {
                return promise.then(function (data) {
                    eventService.UpdateTurnos();
                    var indice = vm.turnos.findIndex(function (e) { return e.ID = turno.ID; });
                    vm.turnos[indice] = turnoService.sesionesOrder(JSON.parse(data));
                    vm.turnos[indice].visible = turno.visible;
                    vm.turnos[indice].begin = turno.begin;
                    vm.turnos[indice].end = turno.end;
                })
                    .catch(function (error) { });
            }, vm.parent.parent());
        };
        vm.$onChanges = function (change) {
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
        };
        vm.openDiagnostico = function (turno) {
            turnoService.openDiagnostico(vm.paciente, turno, function (promise) {
                return promise.then(function (data) {
                    eventService.UpdateTurnos();
                    if (vm.onAdddiagnostico) {
                        vm.onAdddiagnostico()();
                    }
                })
                    .catch(function (error) { });
            }, vm.parent.parent());
        };
        vm.showModal = function (ev) {
            var modalHtml = "\n                <md-dialog aria-label=\"Turnos\">\n                  <form ng-cloak>\n                    <md-toolbar>\n                      <div class=\"md-toolbar-tools  badge-warning\">\n                        <h5 class=\"modal-title\">Turnos</h5>        \n                      </div>\n                    </md-toolbar>\n                    <md-dialog-content>\n                      <div class=\"md-dialog-content\">        \n                        <p>\n                          Esta seguro que desea cancelar el turno " + vm.selectedTurno.ID + "?\n                        </p>\n                      </div>\n                    </md-dialog-content>\n\n                    <md-dialog-actions layout=\"row\">      \n                      <span flex></span>\n                      <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>\n                      <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> Aceptar</md-button>\n                    </md-dialog-actions>\n                  </form>\n                </md-dialog>\n                ";
            $mdDialog.show({
                template: modalHtml,
                controller: DialogController,
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: vm.selectedTurno }
            })
                .then(function (answer) {
                var url = "Sesion/Pendiente/Anular";
                var params = {};
                params.id = vm.selectedTurno.ID;
                var promise = crudService.PutHttp(url, params);
                promise.then(function (data) {
                    getTurnosPaciente(vm.paciente.ID);
                    eventService.UpdateTurnos();
                })
                    .catch(function (err) { });
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
    function datosSesionesController(turnoService, eventService, pdfService, crudService, $window, $mdSelect, $filter, $location, $route, $timeout, $mdDialog, $element) {
        var vm = this;
        vm.paciente = {};
        vm.PacienteID = 0;
        vm.TurnoID = 0;
        vm.parent = $element.children();
        vm.$onInit = function () { return init; };
        var init = function () {
            getPaciente(vm.PacienteID);
        };
        vm.pacienteChange = function () {
            init();
        };
        var getPaciente = function (id) {
            if (id && id > 0) {
                var promise = turnoService.getPaciente(id);
                promise.then(function (data) {
                    vm.paciente = JSON.parse(data);
                })
                    .catch(function (err) { vm.paciente = []; vm.reading = false; });
            }
            else {
                vm.paciente = {};
            }
        };
        vm.turnoChange = function () {
            init();
        };
        vm.$onChanges = function (change) {
            init();
        };
        vm.close = function () {
            $('#DatosSesiones').modal('hide');
        };
    }
})();
//# sourceMappingURL=PacienteTurnosComponent.js.map