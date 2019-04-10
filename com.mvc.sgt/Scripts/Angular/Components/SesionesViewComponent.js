(function () {
    var sgtApp = angular.module("sgtApp");    

    sgtApp.component('sesionesView', {
        templateUrl: Domain + 'Paciente/ViewSesiones',
        controller: ['turnoService', 'eventService','$element', sesionesViewController],
        bindings: {
            divid: "@"
        }
    });

    function sesionesViewController(turnoService, eventService, $element) {
        vm = this;
        vm.currentPage = 0;
        vm.initPage = 0;
        vm.registerCount = 0;
        vm.PacienteID = 0;

        vm.$onInit = () => init;



        let init = () => {
            vm.currentPage = 0;
            vm.initPage = 0;            
            vm.registerCount = 0;
            vm.turnos = [];
            vm.turno = {};            
            getConsultorios();
        };

        vm.setPage = (pageNumber) => {
            vm.currentPage = pageNumber;
            vm.turno = vm.turnos[pageNumber];
        };

        vm.pacienteChange = () => {
            init();
        };

        vm.pacienteSeleccionado = {};

        vm.toDate = turnoService.toDate;

        vm.toHourRange = turnoService.toHourRange;

        vm.toHour = turnoService.toHour;

        vm.nextHour = turnoService.nextHour;

        vm.getNombreEstado = (idEstado) => turnoService.getNombreEstado(idEstado, vm.Estados);

        vm.getNombreConsultorio = (idConsultorio) => turnoService.getNombreConsultorio(idConsultorio, vm.Consultorios);

        vm.turnoPrint = () => turnoService.turnoPrint(vm.turno, vm.paciente, vm.Consultorios, vm.Estados);


        let getEstados = () => {
            let promise = turnoService.getEstados();
            promise.then(data => {
                vm.Estados = data;                
                if (vm.PacienteID > 0) {
                    getTurnosPaciente(vm.PacienteID);
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
            let promise = turnoService.getTurnosPaciente(id);
            promise.then(data => {   
                
                vm.turnos = turnoService.turnosSesionesOrder(JSON.parse(data));                                
                vm.turno = vm.turnos[vm.currentPage];
                vm.registerCount = vm.turnos.length;
            })
                .catch(err => { vm.turnos = [];});
        };

      
        

        vm.turnoChange = () => {
            Estados = [];
            Consultorios = [];
            getConsultorios();
        };

        vm.$onChanges = (change) => {
            Estados = [];
            Consultorios = [];
            getConsultorios();
        };

        vm.openDiagnostico = () => {
            turnoService.openDiagnostico(vm.turno,
                (promise) =>
                    promise.then(data => vm.turno = turnoService.sesionesOrder(JSON.parse(data)))
                        .catch(error => { }), $element
            );
        };

        vm.cancelarTurno = () => {
            turnoService.cancelarTurno(vm.turno, promise => {
                promise.then(data => {
                    getTurnosPaciente(vm.PacienteID);
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
                getTurnosPaciente(vm.PacienteID);
                eventService.UpdateTurnos();
            })
                .catch(err => { });

        };

        vm.agregarSesiones = () => {
            turnoService.AgregarSesionesTurno(vm.turno, (promise) => {
                promise.then(data => { eventService.UpdateTurnos(); })
                    .catch(error => { });
            }, $element);
        };

        vm.posponerSesion = () => {
            turnoService.openPosponerSesionModal(vm.turno, refreshTurno, $element);
        };

        let refreshTurno = (data) => {
            getTurnosPaciente(vm.PacienteID);
            eventService.UpdateTurnos();
        };
    }
})();