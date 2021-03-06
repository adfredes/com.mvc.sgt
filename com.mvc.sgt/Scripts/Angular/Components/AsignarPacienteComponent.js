﻿(function () {
    var sgtApp = angular.module("sgtApp");


    sgtApp.component('asignarPaciente', {
        templateUrl: Domain + 'Turno/AsignarPaciente',
        bindings: {
            turno: "<?",
            cancelar: "&",        
            onChanges: "&?"
        },
        controller: ['$route', '$location', '$timeout', '$window','messageService','turnoService', 'eventService', '$element', asignarPacienteController]
    });

    function asignarPacienteController($route, $location, $timeout, $window, messageService, turnoService, eventService, $element) {
        let vm = this;
        vm.pacienteSeleccionado = {};
        vm.SelectedSesiones = [];

        vm.toDate = turnoService.toDate;

        vm.toHourRange = turnoService.toHourRange;

        vm.toHour = turnoService.toHour;

        vm.nextHour = turnoService.nextHour;

        vm.getNombreEstado = (idEstado) => turnoService.getNombreEstado(idEstado, vm.Estados);

        vm.getNombreConsultorio = (idConsultorio) => turnoService.getNombreConsultorio(idConsultorio, vm.Consultorios);

        vm.turnoPrint = () => turnoService.turnoPrint(vm.turno, vm.paciente);

        vm.sesionClick = function (fecha) {
            $window.sessionStorage.removeItem('FechaGrillaTurnos');
            $window.sessionStorage.removeItem('VistaGrillaTurnos');
            $window.sessionStorage.setItem('FechaGrillaTurnos', moment(fecha).toDate());
            $window.sessionStorage.setItem('VistaGrillaTurnos', 'd');
            $('#' + vm.divid).modal('hide');

            $timeout(() => {
                if ($location.path() == '/Turnos') {
                    $route.reload();
                }
                else {
                    $location.path('/Turnos');
                }

            }, 500);
        };

        vm.close = () => vm.cancelar();

        let getEstados = () => {
            let promise = turnoService.getEstados();
            promise.then(data => {
                vm.Estados = data;
                if (vm.turno && vm.turno.ID) {
                    getTurno(vm.turno.ID);
                }
            })
                .catch(err => { vm.turno = []; });
        };

        let getConsultorios = () => {
            let promise = turnoService.getConsultorios();
            promise.then(data => {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let getTurno = (id) => {
            let promise = turnoService.getTurno(id);
            promise.then(data => {
                vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                getPaciente(vm.turno.PacienteID);
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let getPaciente = id => {
            if (id && id > 0) {
                let promise = turnoService.getPaciente(id);
                promise.then(data => {
                    vm.paciente = JSON.parse(data);
                })
                    .catch(err => { vm.turnos = []; vm.reading = false; });
            }
            else {
                vm.paciente = {};
            }
        };

        vm.turnoChange = () => {
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

        vm.$onChanges = (change) => {
            vm.turnoChange();
        };

        vm.SelectPaciente = data => {
            //vm.paciente = {};
            vm.pacienteSeleccionado = data;
        };

        vm.sinPaciente = () => {
            vm.paciente = {};
            vm.pacienteSeleccionado = {};
        };

        vm.openDiagnostico = () => {
            
            turnoService.openDiagnostico(vm.paciente, vm.turno,
                (promise) =>
                    promise.then(data => {
                        eventService.UpdateTurnos();
                        vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                    })
                        .catch(error => { }), $element
            );
        };

        vm.asignarPaciente = async () => {
            vm.paciente = JSON.parse(JSON.stringify(vm.pacienteSeleccionado));                        
            vm.turno.PacienteID = vm.paciente.ID;

            if (await turnoService.IsTurnoSuperpuestoPaciente(vm.turno) == true) {
                const ignorar = await messageService.showConfirm('Turnos', 'La sesion esta superpuesta', 'IGNORAR', 'CANCELAR', $element)
                    .then(() => true)
                    .catch(() => false);                
                if (!ignorar) {
                    vm.saving = false;
                    return;
                }
            }


            turnoService.asignarPaciente(vm.turno)
                .then(data => {
                    existTurnosAnteriores();
                    //turnoService.IsTurnoSuperpuesto(vm.turno.ID)
                    //    .then(data => {
                    //        if (data) {
                    //            turnoService.Notify('Turnos', 'Existen sesiones superpuestas', $element)
                    //                .then(answer => existTurnosAnteriores());
                    //        }
                    //        else {
                    //            existTurnosAnteriores();
                    //        }
                    //    });
                })
                .catch(error => turnoService.Notify('Turnos', error, $element));
        };

        vm.ConfirmarPacienteTurno = () => existTurnosAnteriores();

        let existTurnosAnteriores = () => {
            turnoService.existTurnosAnteriores(vm.turno.PacienteID, vm.turno.TipoSesionID)
                .then(data => {

                    if (data) {
                        vm.continuarSesiones();
                        //turnoService.openContinuarSesiones(vm.continuarSesiones, $element);
                        //turnoService.openContinuarSesiones(vm.confirmarTurno, $element);
                    }
                    else {
                        vm.confirmarTurno(false);
                    }
                })
                .catch(ex => console.dir(ex));
        };

        vm.continuarSesiones = (continuar) => {
            //if (continuar) {
            turnoService.openSelectTurnoContinuar(vm.turno, vm.confirmarTurno, $element);
            //}
            //else {
            //    vm.confirmarTurno(continuar, null);
            //}

        };

        vm.confirmarTurno = (continuar, turnoID) => {
            turnoService.confirmarTurno(vm.turno, continuar, turnoID)
                .then(data => {
                    vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                    eventService.UpdateTurnos();
                    if (!continuar) {
                        vm.openDiagnostico();                        
                    }                    
                    if (vm.onChanges) {
                        vm.onChanges()();
                    }
                })
                .catch(error => { });
        };

        vm.cancelarTurno = () => {
            turnoService.cancelarTurno(vm.turno, promise => {
                promise.then(data => {
                    getTurno(vm.turno.ID);
                    eventService.UpdateTurnos();
                    if (vm.onChanges) {
                        vm.onChanges()();
                    }
                });
            }, $element);

        };

        vm.cancelarSesiones = () => {
            turnoService.cancelarSesiones(vm.turno, promise => {
                promise.then(data => {
                    getTurnosPaciente(vm.PacienteID);
                    eventService.UpdateTurnos();
                });
            }, $element);

        };

        vm.openCambiarSesionModal = (sesion) => turnoService.openCambiarSesionModal(sesion, (data) => {
            eventService.UpdateTurnos();
            getTurno(vm.turno.ID);
            if (vm.onChanges) {
                vm.onChanges()();
            }
        }, $element.children());

        vm.changeSesionState = (asistio) => {
            let sesiones = [];
            vm.turno.Sesions.filter(s => s.selected === true)
                .forEach(s => {
                    sesiones.push(s.ID);
                });
            let promise;
            if (asistio) {
                promise = turnoService.setEstadoAsistio(sesiones);
            }
            else {
                promise = turnoService.setEstadoNoAsistio(sesiones);
            }
            promise.then(data => {
                getTurno(vm.turno.ID);
                eventService.UpdateTurnos();
                if (vm.onChanges) {
                    vm.onChanges()();
                }
            })
                .catch(err => { });

        };

        vm.agregarSesiones = () => {
            turnoService.AgregarSesionesTurno(vm.turno, (promise) => {
                promise.then(data => {
                    refresh();
                })
                    .catch(error => { });
            }, $element);
        };

        vm.posponerSesion = () => {
            turnoService.openPosponerSesionModal(vm.turno, refresh, $element);
        };

        vm.sendTurno = () => {
            turnoService.sendTurno(vm.turno.ID)
                .then(() => messageService.Notify('Turnos', 'Mail enviado.', $element))
                .catch(() => messageService.Notify('Turnos', 'El mail no pudo enviarse.', $element));
        };

        vm.openDobleOrden = () => {
            turnoService.openDobleOrden(vm.turno,
                (promise) =>
                    promise.then(data => {
                        vm.turno.TurnoDoble = JSON.parse(data).TurnoDoble;
                        eventService.UpdateTurnos();
                    })
                        .catch(error => { }), $element
            );
        };

        let refresh = () => {
            turnoService.IsTurnoSuperpuesto(vm.turno.ID)
                .then(data => {
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

        vm.sendTurnoWhatsapp = () => {
            window.open(turnoService.linkWhatsapp(vm.turno, vm.paciente));
        };

        vm.getTipoSesion = (idTipo) => turnoService.getTipoSesion(idTipo);

        vm.addedPaciente = (paciente) => {
            vm.SelectPaciente(paciente);
            vm.asignarPaciente();
        };
    }
})();