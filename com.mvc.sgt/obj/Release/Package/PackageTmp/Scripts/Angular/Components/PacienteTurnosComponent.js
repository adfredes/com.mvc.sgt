(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.controller('pacienteTurnosController', ['crudService', '$window', '$mdSelect', '$filter', '$location', '$route', '$timeout', pacienteTurnosController]);

    sgtApp.component('pacienteTurnos', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/ViewTurnos',
        controller: pacienteTurnosController,
        bindings: {
            paciente: "<?",
            onClose: "&?"
        }
    });


    /*
        $onInit
        $onDestroy
        $onChanges(change)
        $postLink
    */

    function pacienteTurnosController(crudService, $window, $mdSelect, $filter, $location, $route, $timeout) {
        let vm = this;
        vm.turnos = [];
        let Estados = [];
        let Consultorios = [];

        vm.toDate = function (value) {
            let dateValue = moment(value).toDate();                                    
            return angular.isDate(dateValue) ? getDayName(dateValue) + ' ' + toShortDate(dateValue) : '';
        };

        let getDayName = (value) => {
            let weekday = new Array(7);
            weekday[0] = "Domingo";
            weekday[1] = "Lunes";
            weekday[2] = "Martes";
            weekday[3] = "Miércoles";
            weekday[4] = "Jueves";
            weekday[5] = "Viernes";
            weekday[6] = "Sábado";
            return weekday[value.getDay()];
        };

        let toShortDate = (value) => {
            let sDia = addZero(value.getDate());
            let sMes = addZero(value.getMonth() + 1);
            let sAnio = value.getFullYear();

            let sFecha = sDia + "/" + sMes + "/" + sAnio;

            return sFecha;
        };

        let addZero = (i) =>
            i < 10 ? '0' + i : i;        

        vm.toHour = function (value) {            
            let dateValue = moment(value).toDate();                            
            /*value.setHours(value.getHours() - 3);*/            
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };

        vm.nextHour = function (value, sesiones) {
            let dateValue = moment(value).toDate();            
            /*value.setHours(value.getHours() - 3);*/
            if (angular.isDate(dateValue))
                dateValue.setMinutes(30 * sesiones);
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };

        vm.getNombreEstado = function (idEstado) {
            return vm.Estados.find(estado => estado.ID === idEstado).Descripcion;
        };

        vm.getNombreConsultorio = function (idConsultorio) {
            return vm.Consultorios.find(consultorio => consultorio.ID === idConsultorio).Descripcion;
        };

        vm.sesionClick = function (fecha) {            
            $window.sessionStorage.removeItem('FechaGrillaTurnos');
            $window.sessionStorage.removeItem('VistaGrillaTurnos');
            $window.sessionStorage.setItem('FechaGrillaTurnos', moment(fecha).toDate());
            $window.sessionStorage.setItem('VistaGrillaTurnos', 'd');            
            if (vm.onClose) {
                vm.onClose();
            }            

            $timeout(() => {
                if ($location.path() == '/Turnos') {
                    $route.reload();
                }
                else {
                    $location.path('/Turnos');
                }
            }, 500);                                   
        };

        let getEstados = () => {
            let promise = crudService.GetPHttp(`api/grilla/Estados`);
            promise.then(data => {
                vm.Estados = data;
                if (vm.paciente && vm.paciente.ID) {
                    getTurnosPaciente(vm.paciente.ID);
                }
            })
                .catch(err => vm.turnos = []);
        };

        let getConsultorios = () => {
            let promise = crudService.GetPHttp(`api/grilla/Consultorios`);
            promise.then(data => {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(err => vm.turnos = []);
        };

        let getTurnosPaciente = (id) => {
            let promise = crudService.GetPHttp(`Paciente/ListTurnos/${id}`);
            promise.then(data => {
                vm.turnos = sesionesOrder(data);
            })
                .catch(err => vm.turnos = []);
        };

        let sesionesOrder = (data) => {
            data.forEach(turno => {                
                let sesiones = JSON.parse(JSON.stringify(turno.Sesions.filter((value, index, self) =>
                    self.findIndex(element => element.Numero === value.Numero && element.ID < value.ID + 3
                        && element.Estado === value.Estado && element.ConsultorioID === value.ConsultorioID
                        && element.TurnoSimultaneo === value.TurnoSimultaneo
                    )
                    === index
                )));

                sesiones.forEach(mValue => {
                    let result = turno.Sesions.filter(fValue =>
                        mValue.ID + 3 > fValue.ID && mValue.Numero === fValue.Numero
                        && mValue.Estado === fValue.Estado && mValue.ConsultorioID === fValue.ConsultorioID
                        && mValue.TurnoSimultaneo === fValue.TurnoSimultaneo
                    ).length;
                    mValue.sesiones = result;
                });
                turno.Sesions = sesiones.sort((a, b) => b.Numero - a.Numero
                );
                let fechaActual = new Date();
                if (fechaActual.getTime() <= moment(turno.Sesions[0].FechaHora).toDate().getTime() && fechaActual.getTime() >= moment(turno.Sesions[turno.Sesions.length - 1].FechaHora).toDate().getTime())
                    turno.visible = true;                
                else
                    turno.visible = false;
                turno.begin = turno.Sesions[turno.Sesions.length - 1].FechaHora;
                turno.end = turno.Sesions[0].FechaHora;
            });
            return data;
        };
            /*let _sesiones = options.sesiones.filter((value, index, self) =>
                self.findIndex(element => element.TurnoID == value.TurnoID && element.Numero == value.Numero) == index);
            _sesiones.map(mValue => mValue.sesiones = options.sesiones.filter(fValue => mValue.TurnoID == fValue.TurnoID && mValue.Numero == fValue.Numero));*/
           
        

        vm.$onInit = () => {
            getConsultorios();
        };

        vm.$onChanges = (change) => {
            getConsultorios();
        };


    }
})();