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
    sgtApp.component('sesionEdit', {
        templateUrl: Domain + 'Sesion/ChangeDate',
        controller: ['messageService', 'turnoService', 'eventService', 'crudService', '$mdDialog', '$element', sesionEditController],
        bindings: {
            sesion: "<?",
            divid: "@"
        }
    });
    sgtApp.component('sesionEditModal', {
        templateUrl: Domain + 'Sesion/ChangeDateModal',
        controller: ['messageService', 'turnoService', 'eventService', 'crudService', '$mdDialog', '$element', sesionEditController],
        bindings: {
            sesion: "<?",
            onSave: "&?",
            onCancel: "&?"
        }
    });
    function sesionEditController(messageService, turnoService, eventService, crudService, $mdDialog, $element) {
        var _this = this;
        var vm = this;
        vm.selectedDate = null;
        vm.modulos = null;
        vm.motivo = 9;
        vm.saving = false;
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
            vm.saveChange();
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
            if (vm.onCancel) {
                vm.onCancel()();
            }
        };
        vm.saveChange = function () { return __awaiter(_this, void 0, void 0, function () {
            var _sesiones_1, ignorar, i, _fechaHora, _sesion, url, promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!vm.saving) return [3, 4];
                        vm.saving = true;
                        _sesiones_1 = [];
                        return [4, turnoService.IsSesionSuperpuesta(vm.sesion.ID, new Date(vm.selectedDate.getTime()))];
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
                        for (i = 0; i < vm.modulos; i++) {
                            _fechaHora = new Date(vm.selectedDate.getTime());
                            _fechaHora.setMinutes(_fechaHora.getMinutes() + 30 * i);
                            _sesion = {
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
                            _sesiones_1.push(_sesion);
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
                            _sesiones_1.push(_sesion);
                        });
                        url = "Sesion/CambiarFecha";
                        promise = crudService.PutHttp(url, _sesiones_1);
                        promise.then(function (data) {
                            eventService.UpdateTurnos();
                            if (vm.onSave) {
                                vm.onSave()(data);
                            }
                            else {
                                $('#' + vm.divid).modal('hide');
                            }
                        })
                            .catch(function (err) {
                            vm.saving = false;
                            vm.showModal(err.data, $element);
                        });
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        }); };
        vm.showModal = function (_error, parentEl) {
            var modalHtml = "\n<md-dialog aria-label=\"Turnos\">\n  <form ng-cloak>\n    <md-toolbar>\n      <div class=\"md-toolbar-tools  badge-warning\">\n        <h5 class=\"modal-title\">Turnos</h5>        \n      </div>\n    </md-toolbar>\n    <md-dialog-content>\n      <div class=\"md-dialog-content\">        \n        <p>\n          " + _error + "\n        </p>\n      </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout=\"row\">      \n      <span flex></span>      \n      <md-button type='button' class='md-raised md-primary' ng-click='hide()'><span class='icon-ok'></span> Aceptar</md-button>\n    </md-dialog-actions>\n  </form>\n</md-dialog>\n";
            $mdDialog.show({
                parent: angular.element(document.body),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: false,
                multiple: true,
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