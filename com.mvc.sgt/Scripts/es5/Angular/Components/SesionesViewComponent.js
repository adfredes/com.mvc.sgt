(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('sesionesView', {
        templateUrl: Domain + 'Paciente/ViewSesiones',
        controller: ['$route', '$location', '$timeout', '$window', 'messageService', 'turnoService', 'eventService', '$element', sesionesViewController],
        bindings: {
            divid: "@"
        }
    });
    function sesionesViewController($route, $location, $timeout, $window, messageService, turnoService, eventService, $element) {
        vm = this;
        vm.currentPage = 0;
        vm.initPage = 0;
        vm.registerCount = 0;
        vm.PacienteID = 0;
        vm.TurnoID = 0;
        vm.getInformation = false;
        vm.$onInit = function () { return init; };
        var init = function () {
            vm.getInformation = true;
            vm.currentPage = 0;
            vm.initPage = 0;
            vm.registerCount = 0;
            vm.turnos = [];
            vm.turno = {};
            getConsultorios();
        };
        vm.setPage = function (pageNumber) {
            vm.currentPage = pageNumber;
            vm.turno = vm.turnos[pageNumber];
        };
        vm.pacienteChange = function () {
            init();
        };
        vm.sesionClick = function (fecha) {
            $window.sessionStorage.removeItem('FechaGrillaTurnos');
            $window.sessionStorage.removeItem('VistaGrillaTurnos');
            $window.sessionStorage.setItem('FechaGrillaTurnos', moment(fecha).toDate());
            $window.sessionStorage.setItem('VistaGrillaTurnos', 'd');
            $('#' + vm.divid).modal('hide');
            $timeout(function () {
                if ($location.path() == '/Turnos') {
                    $route.reload();
                }
                else {
                    $location.path('/Turnos');
                }
            }, 500);
        };
        vm.bolder = function (estado) { return turnoService.bolder(estado); };
        vm.pacienteSeleccionado = {};
        vm.toDate = turnoService.toDate;
        vm.toHourRange = turnoService.toHourRange;
        vm.toHour = turnoService.toHour;
        vm.nextHour = turnoService.nextHour;
        vm.getNombreEstado = function (idEstado) { return turnoService.getNombreEstado(idEstado, vm.Estados); };
        vm.getNombreConsultorio = function (idConsultorio) { return turnoService.getNombreConsultorio(idConsultorio, vm.Consultorios); };
        vm.getColorConsultorio = function (idConsultorio) { return turnoService.getColorConsultorio(idConsultorio, vm.Consultorios); };
        vm.turnoPrint = function () { return turnoService.turnoPrint(vm.turno, vm.paciente); };
        var getEstados = function () {
            var promise = turnoService.getEstados();
            promise.then(function (data) {
                vm.Estados = data;
                if (vm.PacienteID > 0) {
                    getTurnosPaciente(vm.PacienteID);
                }
            })
                .catch(function (err) {
                vm.turnos = [];
                vm.turno = {};
            });
        };
        var getConsultorios = function () {
            var promise = turnoService.getConsultorios();
            promise.then(function (data) {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        var getTurnosPaciente = function (id) {
            getPaciente(vm.PacienteID);
            var promise = turnoService.getTurnosPaciente(id);
            promise.then(function (data) {
                vm.turnos = turnoService.turnosSesionesOrder(JSON.parse(data));
                vm.currentPage = vm.turnos.findIndex(function (e) { return e.ID == vm.TurnoID; });
                vm.currentPage = vm.currentPage == -1 ? 0 : vm.currentPage;
                vm.turno = vm.turnos[vm.currentPage];
                vm.registerCount = vm.turnos.length;
                vm.getInformation = false;
            })
                .catch(function (err) { vm.turnos = []; });
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
        vm.getTipoSesion = function (idTipo) { return turnoService.getTipoSesion(idTipo); };
        vm.turnoChange = function () {
            Estados = [];
            Consultorios = [];
            getConsultorios();
        };
        vm.$onChanges = function (change) {
            Estados = [];
            Consultorios = [];
            getConsultorios();
        };
        vm.openDiagnostico = function () {
            turnoService.openDiagnostico(vm.paciente, vm.turno, function (promise) {
                return promise.then(function (data) {
                    eventService.UpdateTurnos();
                    vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                })
                    .catch(function (error) { });
            }, $element);
        };
        vm.cancelarTurno = function () {
            turnoService.cancelarTurno(vm.turno, function (promise) {
                promise.then(function (data) {
                    getTurnosPaciente(vm.PacienteID);
                    eventService.UpdateTurnos();
                });
            }, $element);
        };
        vm.cancelarSesiones = function () {
            turnoService.cancelarSesiones(vm.turno, function (promise) {
                promise.then(function (data) {
                    getTurnosPaciente(vm.PacienteID);
                    eventService.UpdateTurnos();
                });
            }, $element);
        };
        vm.changeSesionState = function (asistio) {
            var sesiones = [];
            vm.turno.Sesions.filter(function (s) { return s.selected === true; })
                .forEach(function (s) {
                sesiones.push(s.ID);
            });
            var promise;
            if (asistio) {
                promise = turnoService.setEstadoAsistio(sesiones);
            }
            else {
                promise = turnoService.setEstadoNoAsistio(sesiones);
            }
            promise.then(function (data) {
                getTurnosPaciente(vm.PacienteID);
                eventService.UpdateTurnos();
            })
                .catch(function (err) { });
        };
        vm.agregarSesiones = function () {
            turnoService.AgregarSesionesTurno(vm.turno, function (promise) {
                promise.then(function (data) { refreshTurno(); })
                    .catch(function (error) { });
            }, $element);
        };
        vm.posponerSesion = function () {
            turnoService.openPosponerSesionModal(vm.turno, refreshTurno, $element);
        };
        vm.sendTurno = function () {
            turnoService.sendTurno(vm.turno.ID)
                .then(function () { return messageService.Notify('Turnos', 'Mail enviado.', $element); })
                .catch(function () { return messageService.Notify('Turnos', 'El mail no pudo enviarse.', $element); });
        };
        var refreshTurno = function (data) {
            turnoService.IsTurnoSuperpuesto(vm.turno.ID)
                .then(function (resp) {
                if (resp) {
                    turnoService.Notify('Turnos', 'Existen sesiones superpuestas', $element);
                }
            });
            getTurnosPaciente(vm.PacienteID);
            eventService.UpdateTurnos();
        };
        vm.openDobleOrden = function () {
            turnoService.openDobleOrden(vm.turno, function (promise) {
                return promise.then(function (data) {
                    eventService.UpdateTurnos();
                    vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                })
                    .catch(function (error) { });
            }, $element);
        };
        var getTurno = function (id) {
            var promise = turnoService.getTurno(id);
            promise.then(function (data) {
                vm.turno = turnoService.sesionesOrder(JSON.parse(data));
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        var updateData = function () {
            eventService.UpdateTurnos();
            getTurno(vm.turno.ID);
        };
        vm.openCambiarSesionModal = function (sesion) { return turnoService.openCambiarSesionModal(sesion, updateData, $element.children()); };
        vm.sesionAnular = function (id) {
            turnoService.sesionAnular(id, updateData, $element.children());
        };
        vm.sendTurnoWhatsapp = function () {
            window.open(turnoService.linkWhatsapp(vm.turno, vm.paciente));
        };
    }
})();
//# sourceMappingURL=SesionesViewComponent.js.map