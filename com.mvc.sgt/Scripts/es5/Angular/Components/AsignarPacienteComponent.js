(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('asignarPaciente', {
        templateUrl: Domain + 'Turno/AsignarPaciente',
        bindings: {
            turno: "<?",
            divid: "@",
            onChanges: "&?"
        },
        controller: ['turnoService', 'eventService', '$element', asignarPacienteController]
    });
    function asignarPacienteController(turnoService, eventService, $element) {
        var vm = this;
        vm.pacienteSeleccionado = {};
        vm.SelectedSesiones = [];
        vm.toDate = turnoService.toDate;
        vm.toHourRange = turnoService.toHourRange;
        vm.toHour = turnoService.toHour;
        vm.nextHour = turnoService.nextHour;
        vm.getNombreEstado = function (idEstado) { return turnoService.getNombreEstado(idEstado, vm.Estados); };
        vm.getNombreConsultorio = function (idConsultorio) { return turnoService.getNombreConsultorio(idConsultorio, vm.Consultorios); };
        vm.turnoPrint = function () { return turnoService.turnoPrint(vm.turno, vm.paciente, vm.Consultorios, vm.Estados); };
        var getEstados = function () {
            var promise = turnoService.getEstados();
            promise.then(function (data) {
                vm.Estados = data;
                if (vm.turno && vm.turno.ID) {
                    getTurno(vm.turno.ID);
                }
            })
                .catch(function (err) { vm.turno = []; });
        };
        var getConsultorios = function () {
            var promise = turnoService.getConsultorios();
            promise.then(function (data) {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        var getTurno = function (id) {
            var promise = turnoService.getTurno(id);
            promise.then(function (data) {
                vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                getPaciente(vm.turno.PacienteID);
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        var getPaciente = function (id) {
            if (id && id > 0) {
                var promise = turnoService.getPaciente(id);
                promise.then(function (data) {
                    vm.paciente = JSON.parse(data);
                })
                    .catch(function (err) { vm.turnos = []; vm.reading = false; });
            }
            else {
                vm.paciente = {};
            }
        };
        vm.turnoChange = function () {
            if (!vm.turno || !vm.turno.ID || vm.turno.ID === 0) {
                vm.turno = {};
                vm.continuar = false;
            }
            else {
                vm.continuar = false;
                Estados = [];
                Consultorios = [];
                getConsultorios();
            }
        };
        vm.$onChanges = function (change) {
            vm.turnoChange();
        };
        vm.SelectPaciente = function (data) {
            vm.paciente = {};
            vm.pacienteSeleccionado = data;
        };
        vm.sinPaciente = function () {
            vm.paciente = {};
            vm.pacienteSeleccionado = {};
        };
        vm.openDiagnostico = function () {
            turnoService.openDiagnostico(vm.turno, function (promise) {
                return promise.then(function (data) {
                    eventService.UpdateTurnos();
                    vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                })
                    .catch(function (error) { });
            }, $element);
        };
        vm.asignarPaciente = function () {
            vm.paciente = vm.pacienteSeleccionado;
            vm.turno.PacienteID = vm.paciente.ID;
            turnoService.asignarPaciente(vm.turno)
                .then(function (data) {
                turnoService.openContinuarSesiones(vm.confirmarTurno, $element);
            })
                .catch(function (error) { return undefined; });
        };
        vm.confirmarTurno = function (continuar) {
            turnoService.confirmarTurno(vm.turno, continuar)
                .then(function (data) {
                vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                eventService.UpdateTurnos();
                vm.openDiagnostico();
                if (vm.onChanges) {
                    vm.onChanges()();
                }
            })
                .catch(function (error) { });
        };
        vm.cancelarTurno = function () {
            turnoService.cancelarTurno(vm.turno, function (promise) {
                promise.then(function (data) {
                    getTurno(vm.turno.ID);
                    eventService.UpdateTurnos();
                    if (vm.onChanges) {
                        vm.onChanges()();
                    }
                });
            }, $element);
        };
        vm.openCambiarSesionModal = function (sesion) { return turnoService.openCambiarSesionModal(sesion, function (data) {
            getTurno(vm.turno.ID);
            if (vm.onChanges) {
                vm.onChanges()();
            }
        }, $element); };
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
                getTurno(vm.turno.ID);
                eventService.UpdateTurnos();
                if (vm.onChanges) {
                    vm.onChanges()();
                }
            })
                .catch(function (err) { });
        };
        vm.agregarSesiones = function () {
            turnoService.AgregarSesionesTurno(vm.turno, function (promise) {
                promise.then(function (data) {
                    getTurno(vm.turno.ID);
                    eventService.UpdateTurnos();
                    if (vm.onChanges) {
                        vm.onChanges()();
                    }
                })
                    .catch(function (error) { });
            }, $element);
        };
        vm.posponerSesion = function () {
            turnoService.openPosponerSesionModal(vm.turno, refresh, $element);
        };
        vm.sendTurno = function () {
            turnoService.sendTurno(vm.turno.ID)
                .then(function () { return undefined; })
                .catch(function () { return undefined; });
        };
        vm.openDobleOrden = function () {
            turnoService.openDobleOrden(vm.turno, function (promise) {
                return promise.then(function (data) {
                    vm.turno.TurnoDoble = JSON.parse(data).TurnoDoble;
                    eventService.UpdateTurnos();
                })
                    .catch(function (error) { });
            }, $element);
        };
        var refresh = function () {
            getTurno(vm.turno.ID);
            eventService.UpdateTurnos();
            if (vm.onChanges) {
                vm.onChanges()();
            }
        };
        vm.sendTurnoWhatsapp = function () {
            window.open(turnoService.linkWhatsapp(vm.turno, vm.paciente));
        };
    }
})();
//# sourceMappingURL=AsignarPacienteComponent.js.map