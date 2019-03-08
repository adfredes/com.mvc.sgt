(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('sesionEditController', ['eventService','crudService', '$mdDialog', sesionEditController]);

    sgtApp.component('sesionEdit', {
        templateUrl: Domain + 'Sesion/ChangeDate',
        controller: 'sesionEditController',
        bindings: {
            sesion: "<?",
            divid: "@"
        }
    });

    function sesionEditController(eventService, crudService, $mdDialog) {
        let vm = this;

        vm.selectedDate = null;
        vm.modulos = null;
        vm.motivo = 9;
        let ConsultorioID;


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

        let loadSesion = () => {
            let promise = crudService.GetPHttp(`api/sesiones/${vm.sesion.ID}`);
            promise.then(data => {
              
                vm.sesion = data[0];
                vm.sesion.FechaTurno = moment(vm.sesion.FechaHora).toDate();
                vm.sesion.sesiones = data;
                vm.selectedDate = moment(vm.sesion.FechaHora).toDate();
             
                vm.modulos = vm.sesion.sesiones.length;
                getConsultorios(vm.selectedDate);
            })
                .catch(err => vm.paciente = {});
        };

        let getConsultorios = (fechaConsultorio) => {
            let promise = crudService.GetPHttp(`Consultorio/ListarHorarios/${fechaConsultorio.getFullYear()}/${fechaConsultorio.getMonth() + 1}/${fechaConsultorio.getDate()}`);
            promise.then(data => {
                vm.Consultorios = data;
            })
                .catch(err => { vm.turnos = []; vm.reading = false; });
        };


        vm.$onInit = () => {
            vm.Consultorios = [];
            if (!vm.sesion) {
                vm.sesion = {};
            }
            vm.modulos = 1;
            vm.motivo = 9;
        };

        vm.$onChange = (changes) => {
            loadSesion();
            vm.modulos = 1;
            vm.motivo = 9;
            getConsultorios();
        };



        vm.horaClick = (hora, consultorioID) => {
            //vm.sesion.FechaHora = moment(vm.sesion.FechaHora).getDate()
            ConsultorioID = consultorioID;
            vm.selectedDate.setHours(parseInt(hora.split(':')[0]));
            vm.selectedDate.setMinutes(parseInt(hora.split(':')[1]));
            //vm.sesion.FechaHora.split("T")[0] + 'T' + hora + ":00";            
        };

        vm.fechaChange = () => {
            getConsultorios(vm.selectedDate);
        };

        vm.changeSesionID = (e) => {
            vm.modulos = 1;
            vm.motivo = 9;
            if (!vm.sesion.ID || vm.sesion.ID === 0) {
                vm.sesion = {};
            }
            else {
                loadSesion();
            }
        };

        vm.saveChange = (ev) => {
            let _sesiones = [];


            for (let i = 0; i < vm.modulos; i++) {
                let _fechaHora = new Date(vm.selectedDate.getTime());
                _fechaHora.setMinutes(_fechaHora.getMinutes() + 30 * i);
                let _sesion = {
                    ID: null,
                    AgendaID: vm.sesion.AgendaID,
                    TurnoID: vm.sesion.TurnoID,
                    Numero: vm.sesion.Numero,
                    ConsultorioID: ConsultorioID,
                    TurnoSimultaneo: 0,
                    Estado: vm.sesion.Estado,
                    FechaHora: _fechaHora,
                    Habilitado: true
                };
                _sesiones.push(_sesion);

            }

            vm.sesion.sesiones.forEach(s => {
                let _sesion = {
                    ID: s.ID,
                    AgendaID: s.AgendaID,
                    TurnoID: s.TurnoID,
                    Numero: s.Numero,
                    ConsultorioID: s.ConsultorioID,
                    TurnoSimultaneo: s.TurnoSimultaneo,
                    Estado: vm.motivo,
                    FechaHora: s.FechaHora,
                    Habilitado: true
                };
                _sesiones.push(_sesion);
            });

            let url = "Sesion/CambiarFecha";

            let promise = crudService.PutHttp(url, _sesiones);

            promise.then(data => {
                //vm.showModal(ev, 'Se modifico correctamente el turno');
                eventService.UpdateTurnos();
                $('#' + vm.divid).modal('hide');
            })
                .catch(err => {                    
                    vm.showModal(ev, err.data);
                });




        };


        vm.showModal = function (ev, _error) {
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
          ${_error}
        </p>
      </div>
    </md-dialog-content>

    <md-dialog-actions layout="row">      
      <span flex></span>      
      <md-button type='button' class='md-raised md-primary' ng-click='cancel()'><span class='icon-ok'></span> Aceptar</md-button>
    </md-dialog-actions>
  </form>
</md-dialog>
`;

            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                template: modalHtml,
                controller: DialogController,
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: vm.selectedTurno }
            })
                .then(answer => {
                })
                .catch(err => { });        
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