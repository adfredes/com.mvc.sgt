﻿(function () {
    var sgtApp = angular.module("sgtApp");    

    sgtApp.component('sesionesView', {
        templateUrl: Domain + 'Paciente/ViewSesiones',
        controller: ['$route', '$location','$timeout','$window','messageService','turnoService', 'eventService','$element', sesionesViewController],
        bindings: {
            pacienteId: "<?",
            turnoId: "<?",
            cancelar: "&?",
            divid: "@"
        }
    });

    function sesionesViewController($route,$location,$timeout, $window, messageService, turnoService, eventService, $element) {
        vm = this;
        vm.currentPage = 0;
        vm.initPage = 0;
        vm.registerCount = 0;              
        vm.getInformation = false;

        let init = () => {    
            if (vm.turnoId && vm.pacienteId) {                
                vm.getInformation = true;
                vm.currentPage = 0;
                vm.initPage = 0;
                vm.registerCount = 0;
                vm.turnos = [];
                vm.turno = {};
                getConsultorios();            
            }            
        };        
        vm.$onInit = () => init;

        vm.setPage = (pageNumber) => {
            vm.currentPage = pageNumber;
            vm.turno = vm.turnos[pageNumber];
        };       

        vm.sesionClick = function (fecha) {
            $window.sessionStorage.removeItem('FechaGrillaTurnos');
            $window.sessionStorage.removeItem('VistaGrillaTurnos');
            $window.sessionStorage.setItem('FechaGrillaTurnos', moment(fecha).toDate());
            $window.sessionStorage.setItem('VistaGrillaTurnos', 'd');
            vm.cancelar();  

            $timeout(() => {
                if ($location.path() == '/Turnos') {
                    $route.reload();
                }
                else {
                    $location.path('/Turnos');
                }                                                                   
                
            }, 500);
        };

        vm.bolder = (estado) => turnoService.bolder(estado);

        vm.pacienteSeleccionado = {};

        vm.toDate = turnoService.toDate;

        vm.toHourRange = turnoService.toHourRange;

        vm.toHour = turnoService.toHour;

        vm.nextHour = turnoService.nextHour;

        vm.getNombreEstado = (idEstado) => turnoService.getNombreEstado(idEstado, vm.Estados);

        vm.getNombreConsultorio = (idConsultorio) => turnoService.getNombreConsultorio(idConsultorio, vm.Consultorios);

        vm.getColorConsultorio = (idConsultorio) => turnoService.getColorConsultorio(idConsultorio, vm.Consultorios);

        vm.turnoPrint = () => turnoService.turnoPrint(vm.turno, vm.paciente);


        let getEstados = () => {
            let promise = turnoService.getEstados();
            promise.then(data => {
                vm.Estados = data;                
                if (vm.pacienteId > 0) {
                    getTurnosPaciente(vm.pacienteId);
                }
            })
                .catch(err => {
                    vm.turnos = [];
                    vm.turno = {};
                });
        };

        let getConsultorios = () => {
            let promise = turnoService.getConsultorios();
            promise.then(data => {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let getTurnosPaciente = (id) => {
            getPaciente(vm.pacienteId);
            let promise = turnoService.getTurnosPaciente(id);
            promise.then(data => {   
                
                vm.turnos = turnoService.turnosSesionesOrder(JSON.parse(data));                                
                vm.currentPage = vm.turnos.findIndex(e => e.ID == vm.turnoId);
                vm.currentPage = vm.currentPage == -1 ? 0 : vm.currentPage;
                vm.turno = vm.turnos[vm.currentPage];                
                vm.registerCount = vm.turnos.length;
                vm.getInformation = false;
            })
                .catch(err => { vm.turnos = [];});
        };        

        let getPaciente = id => {
            if (id && id > 0) {
                let promise = turnoService.getPaciente(id);
                promise.then(data => {
                    vm.paciente = JSON.parse(data);
                })
                    .catch(err => { vm.paciente = []; vm.reading = false; });
            }
            else {
                vm.paciente = {};
            }
        };
     
      
        vm.getTipoSesion = (idTipo) => turnoService.getTipoSesion(idTipo);

        vm.turnoChange = () => {
            Estados = [];
            Consultorios = [];
            getConsultorios();
        };

        vm.$onChanges = (change) => {
            init();
            /*Estados = [];
            Consultorios = [];
            getConsultorios();*/
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

        vm.cancelarTurno = () => {
            turnoService.cancelarTurno(vm.turno, promise => {
                promise.then(data => {
                    getTurnosPaciente(vm.pacienteId);
                    eventService.UpdateTurnos();
                });
            }, $element);

        };

        vm.cancelarSesiones = () => {
            turnoService.cancelarSesiones(vm.turno, promise => {
                promise.then(data => {
                    getTurnosPaciente(vm.pacienteId);
                    eventService.UpdateTurnos();
                });
            }, $element);

        };

        

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
                getTurnosPaciente(vm.pacienteId);
                eventService.UpdateTurnos();
            })
                .catch(err => { });

        };

        vm.agregarSesiones = () => {
            turnoService.AgregarSesionesTurno(vm.turno, (promise) => {
                promise.then(data => { refreshTurno(); })
                    .catch(error => { });
            }, $element);
        };

        vm.posponerSesion = () => {
            turnoService.openPosponerSesionModal(vm.turno, refreshTurno, $element);
        };

        vm.sendTurno = () => {
            turnoService.sendTurno(vm.turno.ID)
                .then(() => messageService.Notify('Turnos', 'Mail enviado.', $element))
                .catch(() => messageService.Notify('Turnos', 'El mail no pudo enviarse.', $element));
        };

        let refreshTurno = (data) => {
            turnoService.IsTurnoSuperpuesto(vm.turno.ID)
                .then(resp => {
                    if (resp) {
                        turnoService.Notify('Turnos', 'Existen sesiones superpuestas', $element);
                    }
                });
            getTurnosPaciente(vm.pacienteId);
            eventService.UpdateTurnos();
        };

        vm.openDobleOrden = () => {
            turnoService.openDobleOrden(vm.turno,
                (promise) =>
                    promise.then(data => {
                        eventService.UpdateTurnos();
                        vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                    })
                        .catch(error => { }), $element
            );
        };

        let getTurno = (id) => {
            let promise = turnoService.getTurno(id);
            promise.then(data => {
                vm.turno = turnoService.sesionesOrder(JSON.parse(data));                
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let updateData = () => {
            eventService.UpdateTurnos();
            getTurno(vm.turno.ID);
        };

        vm.openCambiarSesionModal = (sesion) =>
            turnoService.openCambiarSesionModal(sesion, updateData, $element.children());

        vm.sesionAnular = (id) => {            
            turnoService.sesionAnular(id, updateData, $element.children());
        };

        vm.sendTurnoWhatsapp = () => {
            window.open(turnoService.linkWhatsapp(vm.turno, vm.paciente));
            
        };
    }
})();