(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('sesionEdit', {
        templateUrl: Domain + 'Sesion/ChangeDate',
        controller: ['turnoService', 'eventService', 'crudService', '$mdDialog', sesionEditController],
        bindings: {
            sesion: "<?",
            divid: "@"
        }
    });
    sgtApp.component('sesionEditModal', {
        templateUrl: Domain + 'Sesion/ChangeDateModal',
        controller: ['turnoService', 'eventService', 'crudService', '$mdDialog', sesionEditController],
        bindings: {
            sesion: "<?",
            onSave: "&?",
            onCancel: "&?"
        }
    });
    function sesionEditController(turnoService, eventService, crudService, $mdDialog) {
        var vm = this;
        vm.selectedDate = null;
        vm.modulos = null;
        vm.motivo = 9;
        var ConsultorioID;
        vm.toDate = turnoService.toDate;
        vm.toHourRange = turnoService.toHourRange;
        vm.toHour = turnoService.toHour;
        vm.nextHour = turnoService.nextHour;
        var loadSesion = function () {
            var promise = turnoService.getSesion(vm.sesion.ID);
            promise.then(function (data) {
                vm.sesion = data[0];
                vm.sesion.FechaTurno = moment(vm.sesion.FechaHora).toDate();
                vm.sesion.sesiones = data;
                vm.selectedDate = moment(vm.sesion.FechaHora).toDate();
                vm.modulos = vm.sesion.sesiones.length;
                getConsultorios(vm.selectedDate);
            })
                .catch(function (err) { return vm.paciente = {}; });
        };
        var getConsultorios = function (fechaConsultorio) {
            var promise = turnoService.getConsultoriosFecha(fechaConsultorio);
            promise.then(function (data) {
                vm.Consultorios = data;
            })
                .catch(function (err) { vm.turnos = []; vm.reading = false; });
        };
        vm.$onInit = function () {
            vm.modulos = 1;
            vm.motivo = 9;
            if (!vm.sesion || !vm.sesion.ID || vm.sesion.ID === 0) {
                vm.sesion = {};
            }
            else {
                loadSesion();
            }
        };
        vm.$onChange = function (changes) {
            vm.modulos = 1;
            vm.motivo = 9;
            if (!vm.sesion.ID || vm.sesion.ID === 0) {
                vm.sesion = {};
            }
            else {
                loadSesion();
            }
        };
        vm.horaClick = function (hora, consultorioID) {
            ConsultorioID = consultorioID;
            vm.selectedDate.setHours(parseInt(hora.split(':')[0]));
            vm.selectedDate.setMinutes(parseInt(hora.split(':')[1]));
        };
        vm.fechaChange = function () {
            getConsultorios(vm.selectedDate);
        };
        vm.changeSesionID = function (e) {
            vm.modulos = 1;
            vm.motivo = 9;
            if (!vm.sesion.ID || vm.sesion.ID === 0) {
                vm.sesion = {};
            }
            else {
                loadSesion();
            }
        };
        vm.closeChange = function () {
            console.dir(vm.onCancel);
            if (vm.onCancel) {
                vm.onCancel()();
            }
        };
        vm.saveChange = function (ev) {
            var _sesiones = [];
            for (var i = 0; i < vm.modulos; i++) {
                var _fechaHora = new Date(vm.selectedDate.getTime());
                _fechaHora.setMinutes(_fechaHora.getMinutes() + 30 * i);
                var _sesion = {
                    ID: null,
                    AgendaID: vm.sesion.AgendaID,
                    TurnoID: vm.sesion.TurnoID,
                    Numero: vm.sesion.Numero,
                    ConsultorioID: ConsultorioID,
                    TurnoSimultaneo: 0,
                    Estado: vm.sesion.Estado == 8 ? vm.sesion.Estado : 2,
                    FechaHora: _fechaHora,
                    Habilitado: true
                };
                _sesiones.push(_sesion);
            }
            vm.sesion.sesiones.forEach(function (s) {
                var _sesion = {
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
            var url = "Sesion/CambiarFecha";
            var promise = crudService.PutHttp(url, _sesiones);
            promise.then(function (data) {
                if (vm.onSave) {
                    vm.onSave()(data);
                }
                else {
                    eventService.UpdateTurnos();
                    $('#' + vm.divid).modal('hide');
                }
            })
                .catch(function (err) {
                vm.showModal(ev, err.data);
            });
        };
        vm.showModal = function (ev, _error) {
            var modalHtml = "\n<md-dialog aria-label=\"Turnos\">\n  <form ng-cloak>\n    <md-toolbar>\n      <div class=\"md-toolbar-tools  badge-warning\">\n        <h5 class=\"modal-title\">Turnos</h5>        \n      </div>\n    </md-toolbar>\n    <md-dialog-content>\n      <div class=\"md-dialog-content\">        \n        <p>\n          " + _error + "\n        </p>\n      </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout=\"row\">      \n      <span flex></span>      \n      <md-button type='button' class='md-raised md-primary' ng-click='cancel()'><span class='icon-ok'></span> Aceptar</md-button>\n    </md-dialog-actions>\n  </form>\n</md-dialog>\n";
            $mdDialog.show({
                template: modalHtml,
                controller: DialogController,
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                locals: { turno: vm.selectedTurno }
            })
                .then(function (answer) {
            })
                .catch(function (err) { });
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
//# sourceMappingURL=SesionEditComponent.js.map