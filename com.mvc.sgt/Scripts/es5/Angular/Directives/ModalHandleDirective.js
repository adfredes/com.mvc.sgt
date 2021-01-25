(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.directive('modalHandle', ['modalComponentService', function (modalComponentService) {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs) {
                    elm.on('openmodal', function ($event) {
                        switch ($event.originalEvent.detail.name) {
                            case 'SesionesView':
                                modalComponentService.openViewSesionesModal($event.originalEvent.detail.valor.pacienteID, $event.originalEvent.detail.valor.turnoID);
                                break;
                            case 'DatosSesiones':
                                modalComponentService.openDatosSesionesModal($event.originalEvent.detail.valor.pacienteID, $event.originalEvent.detail.valor.turnoID);
                                break;
                            case 'PacienteView':
                                modalComponentService.openPacienteModal({ ID: $event.originalEvent.detail.valor.pacienteID });
                                break;
                            case 'AsignarPaciente':
                                modalComponentService.openAsignarPacienteModal({ ID: $event.originalEvent.detail.valor.turnoID });
                                break;
                            case 'SesionEdit':
                                modalComponentService.openSesionEditModal({ ID: $event.originalEvent.detail.valor.sesionID });
                                break;
                        }
                    });
                    var openViewSesionesModal = function (pacienteID, turnoID) {
                        var modalHtml = "\n\n                            <md-dialog style=\"max-height:95%; max-width:80%;\" md-draggable>                            \n                            <sesiones-view paciente-id = \"pacienteID\" turno-id=\"turnoID\" cancelar = \"cancel()\"></sesiones-view>\n                            </md-dialog>\n\n\n                    ";
                        var tempscope = $rootScope.$new();
                        tempscope.pacienteID = pacienteID;
                        tempscope.turnoID = turnoID;
                        tempscope.tile = 'TITULO';
                        function DialogController($scope, $mdDialog) {
                            $scope.hide = function () {
                                $mdDialog.hide();
                            };
                            $scope.cancel = function () {
                                console.log("cancelado");
                                $mdDialog.cancel();
                            };
                            $scope.answer = function (answer) {
                                $mdDialog.hide(answer);
                            };
                        }
                        $mdDialog.show({
                            parent: angular.element(document.body),
                            template: modalHtml,
                            controller: ['$scope', '$mdDialog', DialogController],
                            clickOutsideToClose: false,
                            fullscreen: true,
                            autoWrap: false,
                            scope: tempscope,
                            multiple: true
                        })
                            .then(function (answer) {
                            success(answer);
                        })
                            .catch(function () { });
                    };
                    var openDatosSesionesModal = function (pacienteID, turnoID) {
                        var modalHtml = "\n\n                            <md-dialog style=\"max-height:95%; max-width:80%;min-width:50%;\" md-draggable>\n                            <datos-sesiones paciente-id = \"pacienteID\" turno-id=\"turnoID\" cancelar = \"cancel()\"></datos-sesiones>\n                            </md-dialog>\n\n\n                    ";
                        var tempscope = $rootScope.$new();
                        tempscope.pacienteID = pacienteID;
                        tempscope.turnoID = turnoID;
                        function DialogController($scope, $mdDialog) {
                            $scope.hide = function () {
                                $mdDialog.hide();
                            };
                            $scope.cancel = function () {
                                console.log("cancelado");
                                $mdDialog.cancel();
                            };
                            $scope.answer = function (answer) {
                                $mdDialog.hide(answer);
                            };
                        }
                        $mdDialog.show({
                            parent: angular.element(document.body),
                            template: modalHtml,
                            controller: ['$scope', '$mdDialog', DialogController],
                            clickOutsideToClose: false,
                            fullscreen: true,
                            autoWrap: false,
                            scope: tempscope,
                            multiple: true
                        })
                            .then(function (answer) {
                            success(answer);
                        })
                            .catch(function () { });
                    };
                    var openPacienteModal = function (pacienteID) {
                        var modalHtml = "\n\n                            <md-dialog style=\"max-height:95%; width:60%;\" md-draggable>\n                            <paciente-view paciente-id = \"pacienteID\" cancelar = \"cancel()\"></paciente-view>\n                            </md-dialog>\n\n\n                    ";
                        var tempscope = $rootScope.$new();
                        tempscope.pacienteID = pacienteID;
                        function DialogController($scope, $mdDialog) {
                            $scope.hide = function () {
                                $mdDialog.hide();
                            };
                            $scope.cancel = function () {
                                console.log("cancelado");
                                $mdDialog.cancel();
                            };
                            $scope.answer = function (answer) {
                                $mdDialog.hide(answer);
                            };
                        }
                        $mdDialog.show({
                            parent: angular.element(document.body),
                            template: modalHtml,
                            controller: ['$scope', '$mdDialog', DialogController],
                            clickOutsideToClose: false,
                            fullscreen: true,
                            autoWrap: false,
                            scope: tempscope,
                            multiple: true
                        })
                            .then(function (answer) {
                            success(answer);
                        })
                            .catch(function () { });
                    };
                }
            };
        }]);
})();
//# sourceMappingURL=ModalHandleDirective.js.map