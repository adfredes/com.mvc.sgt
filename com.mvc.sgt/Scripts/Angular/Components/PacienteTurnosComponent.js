(function () {
    var sgtApp = angular.module("sgtApp");

    //sgtApp.controller('pacienteTurnosController', ['eventService','pdfService', 'crudService', '$window', '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog', pacienteTurnosController]);

    sgtApp.component('pacienteTurnos', {
        transclude: {
            'botton': '?button'
        },
        templateUrl: Domain + 'Paciente/ViewTurnos',
        controller: ['eventService', 'pdfService', 'crudService', '$window', '$mdSelect', '$filter', '$location', '$route', '$timeout', '$mdDialog', pacienteTurnosController],
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

    //sgtApp.controller('DialogController', ['$scope', '$mdDialog', DialogController]);

    function pacienteTurnosController(eventService,pdfService, crudService, $window, $mdSelect, $filter, $location, $route, $timeout, $mdDialog) {
        let vm = this;
        vm.turnos = [];
        let Estados = [];
        let Consultorios = [];
        vm.selectedTurno = {};
        vm.deleteTurno = false;

        vm.reading = false;

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

        vm.toHourRange = function (value, sesiones) {
            return vm.toHour(value) + ' a ' + vm.nextHour(value, sesiones);
        };

        vm.toHour = function (value) {
            let dateValue = moment(value).toDate();
            /*value.setHours(value.getHours() - 3);*/
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };

        vm.nextHour = function (value, sesiones) {
            let dateValue = moment(value).toDate();
            /*value.setHours(value.getHours() - 3);*/
            if (angular.isDate(dateValue))
                dateValue.setMinutes(dateValue.getMinutes() + 30 * sesiones);
            return angular.isDate(dateValue) ? addZero(dateValue.getHours()) + ':' + addZero(dateValue.getMinutes()) : '';
        };

        vm.getNombreEstado = function (idEstado) {
            return vm.Estados.find(estado => estado.ID === idEstado).Descripcion;
        };

        vm.getNombreConsultorio = function (idConsultorio) {
            return vm.Consultorios.find(consultorio => consultorio.ID === idConsultorio).Descripcion;
        };

        vm.turnoPrint = function (turno) {
            //pdfService.CreateTurnoPdf($window.document.querySelector('#div' + fecha).innerHTML);
            console.dir(turno);
            let body = [];
            let estadosImprimible = [2, 4, 5];
            turno.Sesions.forEach(sesion => {
                let row = [];
                if (estadosImprimible.includes(sesion.Estado)) {
                    row.push(sesion.Numero.toString());
                    row.push(vm.toDate(sesion.FechaHora));
                    row.push(vm.toHourRange(sesion.FechaHora, sesion.sesiones));
                    row.push(vm.getNombreConsultorio(sesion.ConsultorioID));
                    body.unshift(row);
                }
            });
            body.unshift(['Número', 'Fecha', 'Horario', 'Consultorio']);

            let headerText = `Turno: ${turno.ID} - ${vm.paciente.Apellido}, ${vm.paciente.Nombre}`;
            pdfService.CreateTurnoPdf(body, headerText);
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

        vm.cancelarSesionSelect = function (ev, turno) {                       
            vm.selectedTurno = turno;
            vm.showModal(ev);
        };

        vm.confirmCancelarTurno = function () {
            vm.deleteTurno = false;
        };

        let getEstados = () => {
            vm.reading = true;
            let promise = crudService.GetPHttp(`api/grilla/Estados`);
            promise.then(data => {
                vm.Estados = data;
                if (vm.paciente && vm.paciente.ID) {
                    getTurnosPaciente(vm.paciente.ID);
                }
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let getConsultorios = () => {
            let promise = crudService.GetPHttp(`api/grilla/Consultorios`);
            promise.then(data => {
                vm.Consultorios = data;
                getEstados();
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };

        let getTurnosPaciente = (id) => {
            let promise = crudService.GetPHttp(`Paciente/ListTurnos/${id}`);
            promise.then(data => {
                vm.reading = false;
                vm.turnos = sesionesOrder(JSON.parse(data));                
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
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



        //vm.$onInit = () => {
        //    vm.deleteTurno = false;
        //    getConsultorios();
        //};

        vm.$onChanges = (change) => {
            vm.turnos = [];
            Estados = [];
            Consultorios = [];
            vm.deleteTurno = false;
            getConsultorios();
        };


        vm.showModal = function (ev) {            
            let modalHtml = `
                <md-dialog aria-label="Turnos">
                  <form ng-cloak>
                    <md-toolbar>
                      <div class="md-toolbar-tools  badge-warning">
                        <h5 class="modal-title">Turnos</h5>        
                      </div>
                    </md-toolbar>
                    <md-dialog-content>
                      <div class="md-dialog-content">        
                        <p>
                          Esta seguro que desea cancelar el turno ${vm.selectedTurno.ID}?
                        </p>
                      </div>
                    </md-dialog-content>

                    <md-dialog-actions layout="row">      
                      <span flex></span>
                      <md-button type='button' class='md-raised md-warn' ng-click='cancel()'><i class='icon-cancel'></i> Cancelar</md-button>
                      <md-button type='button' class='md-raised md-primary' ng-click='answer(true)'><span class='icon-ok'></span> Aceptar</md-button>
                    </md-dialog-actions>
                  </form>
                </md-dialog>
                `;

            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                template: modalHtml,
                controller:  DialogController,
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: vm.selectedTurno}
            })
                .then(answer => {                    
                    let url = "Sesion/Pendiente/Anular";
                    let params = {};
                    params.id = vm.selectedTurno.ID;
                    let promise = crudService.PutHttp(url, params);
                    promise.then(data => {                        
                        getTurnosPaciente(vm.paciente.ID);
                        eventService.UpdateTurnos();
                        /*let event = document.createEvent('Event');
                        event.initEvent('UpdateTurnos', true, true);
                        document.dispatchEvent(event);*/
                    })
                        .catch(err => {});
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

    
})();

