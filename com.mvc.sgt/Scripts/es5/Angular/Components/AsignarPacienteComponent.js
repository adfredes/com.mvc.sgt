var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('asignarPaciente', {
        templateUrl: Domain + 'Turno/AsignarPaciente',
        bindings: {
            turno: "<?",
            cancelar: "&",
            onChanges: "&?"
        },
        controller: ['$route', '$location', '$timeout', '$window', 'messageService', 'turnoService', 'eventService', '$element', asignarPacienteController]
    });
    function asignarPacienteController($route, $location, $timeout, $window, messageService, turnoService, eventService, $element) {
        var _this = this;
        var vm = this;
        vm.pacienteSeleccionado = {};
        vm.SelectedSesiones = [];
        vm.toDate = turnoService.toDate;
        vm.toHourRange = turnoService.toHourRange;
        vm.toHour = turnoService.toHour;
        vm.nextHour = turnoService.nextHour;
        vm.getNombreEstado = function (idEstado) { return turnoService.getNombreEstado(idEstado, vm.Estados); };
        vm.getNombreConsultorio = function (idConsultorio) { return turnoService.getNombreConsultorio(idConsultorio, vm.Consultorios); };
        vm.turnoPrint = function () { return turnoService.turnoPrint(vm.turno, vm.paciente); };
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
        vm.close = function () { return vm.cancelar(); };
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
            vm.pacienteSeleccionado = data;
        };
        vm.sinPaciente = function () {
            vm.paciente = {};
            vm.pacienteSeleccionado = {};
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
        vm.asignarPaciente = function () { return __awaiter(_this, void 0, void 0, function () {
            var ignorar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm.paciente = JSON.parse(JSON.stringify(vm.pacienteSeleccionado));
                        vm.turno.PacienteID = vm.paciente.ID;
                        return [4, turnoService.IsTurnoSuperpuestoPaciente(vm.turno)];
                    case 1:
                        if (!((_a.sent()) == true)) return [3, 3];
                        return [4, messageService.showConfirm('Turnos', 'La sesion esta superpuesta', 'IGNORAR', 'CANCELAR', $element)
                                .then(function () { return true; })
                                .catch(function () { return false; })];
                    case 2:
                        ignorar = _a.sent();
                        if (!ignorar) {
                            vm.saving = false;
                            return [2];
                        }
                        _a.label = 3;
                    case 3:
                        turnoService.asignarPaciente(vm.turno)
                            .then(function (data) {
                            existTurnosAnteriores();
                        })
                            .catch(function (error) { return turnoService.Notify('Turnos', error, $element); });
                        return [2];
                }
            });
        }); };
        vm.ConfirmarPacienteTurno = function () { return existTurnosAnteriores(); };
        var existTurnosAnteriores = function () {
            turnoService.existTurnosAnteriores(vm.turno.PacienteID, vm.turno.TipoSesionID)
                .then(function (data) {
                if (data) {
                    vm.continuarSesiones();
                }
                else {
                    vm.confirmarTurno(false);
                }
            })
                .catch(function (ex) { return console.dir(ex); });
        };
        vm.continuarSesiones = function (continuar) {
            turnoService.openSelectTurnoContinuar(vm.turno, vm.confirmarTurno, $element);
        };
        vm.confirmarTurno = function (continuar, turnoID) {
            turnoService.confirmarTurno(vm.turno, continuar, turnoID)
                .then(function (data) {
                vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                eventService.UpdateTurnos();
                if (!continuar) {
                    vm.openDiagnostico();
                }
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
        vm.cancelarSesiones = function () {
            turnoService.cancelarSesiones(vm.turno, function (promise) {
                promise.then(function (data) {
                    getTurnosPaciente(vm.PacienteID);
                    eventService.UpdateTurnos();
                });
            }, $element);
        };
        vm.openCambiarSesionModal = function (sesion) { return turnoService.openCambiarSesionModal(sesion, function (data) {
            eventService.UpdateTurnos();
            getTurno(vm.turno.ID);
            if (vm.onChanges) {
                vm.onChanges()();
            }
        }, $element.children()); };
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
                    refresh();
                })
                    .catch(function (error) { });
            }, $element);
        };
        vm.posponerSesion = function () {
            turnoService.openPosponerSesionModal(vm.turno, refresh, $element);
        };
        vm.sendTurno = function () {
            turnoService.sendTurno(vm.turno.ID)
                .then(function () { return messageService.Notify('Turnos', 'Mail enviado.', $element); })
                .catch(function () { return messageService.Notify('Turnos', 'El mail no pudo enviarse.', $element); });
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
            turnoService.IsTurnoSuperpuesto(vm.turno.ID)
                .then(function (data) {
                if (data) {
                    turnoService.Notify('Turnos', 'Existen sesiones superpuestas', $element);
                }
            });
            getTurno(vm.turno.ID);
            eventService.UpdateTurnos();
            if (vm.onChanges) {
                vm.onChanges()();
            }
        };
        vm.sendTurnoWhatsapp = function () {
            window.open(turnoService.linkWhatsapp(vm.turno, vm.paciente));
        };
        vm.getTipoSesion = function (idTipo) { return turnoService.getTipoSesion(idTipo); };
        vm.addedPaciente = function (paciente) {
            vm.SelectPaciente(paciente);
            vm.asignarPaciente();
        };
    }
})();
//# sourceMappingURL=AsignarPacienteComponent.js.map