(function () {
    var sgtApp = angular.module("sgtApp");
    

    sgtApp.component('asignarPaciente', {
        templateUrl: Domain + 'Turno/AsignarPaciente',
        bindings: {
            turno: "<?",
            divid: "@", 
            onChanges: "&?"
        },
        controller: ['turnoService', 'eventService','$element', asignarPacienteController]
    });

    function asignarPacienteController(turnoService, eventService, $element) {
        let vm = this;
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

        vm.turnoChange = () =>
        {            
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
            vm.paciente = {};
            vm.pacienteSeleccionado = data;            
        };

        vm.sinPaciente = () => {
            vm.paciente = {};
            vm.pacienteSeleccionado = {};            
        };

        vm.openDiagnostico = () => {
            turnoService.openDiagnostico(vm.turno,
                (promise) =>
                    promise.then(data => vm.turno = turnoService.sesionesOrder(JSON.parse(data)))
                        .catch(error => { }), $element
            );                
        };

        vm.asignarPaciente = () => {
            vm.paciente = vm.pacienteSeleccionado;    
            vm.turno.PacienteID = vm.paciente.ID;            
            turnoService.asignarPaciente(vm.turno)
                .then(data => eventService.UpdateTurnos())
                .catch(error => undefined);
        };

        vm.confirmarTurno = () => {
            turnoService.confirmarTurno(vm.turno, vm.continuar)
                .then(data => {
                    vm.turno = turnoService.sesionesOrder(JSON.parse(data));
                    eventService.UpdateTurnos();
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

        vm.openCambiarSesionModal = (sesion) => turnoService.openCambiarSesionModal(sesion, (data) => {            
                getTurno(vm.turno.ID);
                console.dir(data);
                if (vm.onChanges) {
                    vm.onChanges()();
                }            
        }, $element);

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
                    getTurno(vm.turno.ID);
                    eventService.UpdateTurnos();
                    if (vm.onChanges) {
                        vm.onChanges()();
                    }
                })
                    .catch(error => { });
            }, $element);
        };

        


    }
})();