(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.controller('asignarPacienteController', ['turnoService','eventService', asignarPacienteController]);

    sgtApp.component('asignarPaciente', {
        templateUrl: Domain + 'Turno/AsignarPaciente',
        bindings: {
            turno: "<?",
            divid: "@"  
        },
        controller: "asignarPacienteController"
    });

    function asignarPacienteController(turnoService, eventService) {
        let vm = this;
        vm.pacienteSeleccionado = {};

        vm.toDate = turnoService.toDate;

        /*let getDayName = turnoService.getDayName;

        let toShortDate = turnoService.toShortDate;

        let addZero = turnoService.addZero;*/

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
            Estados = [];
            Consultorios = [];
            getConsultorios();
        };

        vm.$onChanges = (change) => {
            Estados = [];
            Consultorios = [];
            getConsultorios();
        };

        vm.SelectPaciente = data => {            
            vm.paciente = {};
            vm.pacienteSeleccionado = data;            
        };

        vm.sinPaciente = () => {
            vm.paciente = {};
            vm.pacienteSeleccionado = {};            
        };

        vm.asignarPaciente = () => {
            vm.paciente = vm.pacienteSeleccionado;            
        };

        vm.cancelarTurno = () => {
            turnoService.cancelarTurno(vm.turno.ID, promise => {
                promise.then(data => {
                    getTurno(vm.turno.ID);
                    eventService.UpdateTurnos();
                });
            });
            
        };


    }
})();

//(function () {
//    var sgtApp = angular.module("sgtApp");

//    sgtApp.controller('asignarPacienteController', ['turnoService', 'eventService', 'pdfService', 'crudService', '$window', '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog', asignarPacienteController]);

//    sgtApp.component('asignarPaciente', {
//        templateUrl: Domain + 'Turno/AsignarPaciente',
//        bindings: {
//            turno: "<?",
//            divid: "@"
//        },
//        controller: "asignarPacienteController"
//    });

//    function asignarPacienteController(turnoService, eventService, pdfService, crudService, $window, $mdSelect, $filter, $location, $route, $timeout, $mdDialog) {
//        let vm = this;
//        vm.pacienteSeleccionado = {};

//        vm.toDate = function (value) {
//            let dateValue = moment(value).toDate();
//            return angular.isDate(dateValue) ? getDayName(dateValue) + ' ' + toShortDate(dateValue) : '';
//        };

//        let getDayName = (value) => {
//            let weekday = new Array(7);
//            weekday[0] = "Domingo";
//            weekday[1] = "Lunes";
//            weekday[2] = "Martes";
//            weekday[3] = "Miércoles";
//            weekday[4] = "Jueves";
//            weekday[5] = "Viernes";
//            weekday[6] = "Sábado";
//            return weekday[value.getDay()];
//        };

//        let toShortDate = (value) => {
//            let sDia = addZero(value.getDate());
//            let sMes = addZero(value.getMonth() + 1);
//            let sAnio = value.getFullYear();

//            let sFecha = sDia + "/" + sMes + "/" + sAnio;

//            return sFecha;
//        };

//        let addZero = (i) =>
//            i < 10 ? '0' + i : i;

//        vm.toHourRange = function (value, sesiones) {
//            return vm.toHour(value) + ' a ' + vm.nextHour(value, sesiones);
//        };

//        vm.toHour = function (value) {
//            let dateValue = moment(value).toDate();
//            /*value.setHours(value.getHours() - 3);*/
//            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
//        };

//        vm.nextHour = function (value, sesiones) {
//            let dateValue = moment(value).toDate();
//            /*value.setHours(value.getHours() - 3);*/
//            if (angular.isDate(dateValue))
//                dateValue.setMinutes(dateValue.getMinutes() + 30 * sesiones);
//            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
//        };

//        vm.getNombreEstado = function (idEstado) {
//            return vm.Estados.find(estado => estado.ID === idEstado).Descripcion;
//        };

//        vm.getNombreConsultorio = function (idConsultorio) {
//            return vm.Consultorios.find(consultorio => consultorio.ID === idConsultorio).Descripcion;
//        };

//        vm.turnoPrint = function () {
//            //pdfService.CreateTurnoPdf($window.document.querySelector('#div' + fecha).innerHTML);       
//            let body = [];
//            let estadosImprimible = [2, 4, 5];
//            vm.turno.Sesions.forEach(sesion => {
//                let row = [];
//                if (estadosImprimible.includes(sesion.Estado)) {
//                    row.push(sesion.Numero.toString());
//                    row.push(vm.toDate(sesion.FechaHora));
//                    row.push(vm.toHourRange(sesion.FechaHora, sesion.sesiones));
//                    row.push(vm.getNombreConsultorio(sesion.ConsultorioID));
//                    body.unshift(row);
//                }
//            });
//            body.unshift(['Número', 'Fecha', 'Horario', 'Consultorio']);

//            let headerText = `Turno: ${vm.turno.ID} - ${vm.paciente.Apellido}, ${vm.paciente.Nombre}`;
//            pdfService.CreateTurnoPdf(body, headerText);
//        };


//        let getEstados = () => {
//            let promise = crudService.GetPHttp(`api/grilla/Estados`);
//            promise.then(data => {
//                vm.Estados = data;
//                if (vm.turno && vm.turno.ID) {
//                    getTurno(vm.turno.ID);
//                }
//            })
//                .catch(err => { vm.turno = []; });
//        };

//        let getConsultorios = () => {
//            let promise = crudService.GetPHttp(`api/grilla/Consultorios`);
//            promise.then(data => {
//                vm.Consultorios = data;
//                getEstados();
//            })
//                .catch(err => { vm.turnos = []; vm.reading = false; });
//        };

//        let getTurno = (id) => {
//            let promise = crudService.GetPHttp(`Turno/${id}`);
//            promise.then(data => {
//                vm.turno = sesionesOrder(JSON.parse(data));
//                getPaciente(vm.turno.PacienteID);
//            })
//                .catch(err => { vm.turnos = []; vm.reading = false; });
//        };

//        let getPaciente = id => {
//            if (id && id > 0) {
//                let promise = crudService.GetPHttp(`Paciente/Get/${id}`);
//                promise.then(data => {
//                    vm.paciente = JSON.parse(data);
//                    //vm.turnos = sesionesOrder(JSON.parse(data));
//                })
//                    .catch(err => { vm.turnos = []; vm.reading = false; });
//            }
//            else {
//                vm.paciente = {};
//            }
//        };

//        let sesionesOrder = (data) => {


//            let sesiones = JSON.parse(JSON.stringify(data.Sesions.filter((value, index, self) =>
//                self.findIndex(element => element.Numero === value.Numero && element.ID < value.ID + 3
//                    && element.Estado === value.Estado && element.ConsultorioID === value.ConsultorioID
//                    && element.TurnoSimultaneo === value.TurnoSimultaneo
//                )
//                === index
//            )));

//            sesiones.forEach(mValue => {
//                let result = data.Sesions.filter(fValue =>
//                    mValue.ID + 3 > fValue.ID && mValue.Numero === fValue.Numero
//                    && mValue.Estado === fValue.Estado && mValue.ConsultorioID === fValue.ConsultorioID
//                    && mValue.TurnoSimultaneo === fValue.TurnoSimultaneo
//                ).length;
//                mValue.sesiones = result;
//            });
//            data.Sesions = sesiones.sort((a, b) => b.Numero - a.Numero
//            );

//            return data;
//        };

//        vm.turnoChange = () => {
//            Estados = [];
//            Consultorios = [];
//            getConsultorios();
//        };

//        vm.$onChanges = (change) => {
//            Estados = [];
//            Consultorios = [];
//            getConsultorios();
//        };

//        vm.SelectPaciente = data => {
//            vm.paciente = {};
//            vm.pacienteSeleccionado = data;
//        };

//        vm.sinPaciente = () => {
//            vm.paciente = {};
//            vm.pacienteSeleccionado = {};
//        };

//        vm.asignarPaciente = () => {
//            vm.paciente = vm.pacienteSeleccionado;
//        };

//    }
//})();