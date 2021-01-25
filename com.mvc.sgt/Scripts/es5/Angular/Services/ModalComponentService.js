(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("modalComponentService", ['$rootScope', '$mdDialog', modalComponentServiceController]);
    function modalComponentServiceController($rootScope, $mdDialog) {
        var $this = this;
        $this.openViewSesionesModal = function (pacienteID, turnoID) {
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
        $this.openDatosSesionesModal = function (pacienteID, turnoID) {
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
        $this.openPacienteModal = function (pacienteID) {
            var modalHtml = "\n\n                            <md-dialog style=\"max-height:95%; width:60%;\" md-draggable>\n                            <paciente-view paciente = \"pacienteID\" cancelar = \"cancel()\"></paciente-view>\n                            </md-dialog>\n\n\n                    ";
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
        $this.openAsignarPacienteModal = function (turno) {
            var modalHtml = "\n\n                            <md-dialog style=\"max-height:95%; min-width:40%;\" md-draggable>\n                            <asignar-paciente turno = \"turno\" cancelar = \"cancel()\"></asignar-paciente>\n                            </md-dialog>\n\n\n                    ";
            var tempscope = $rootScope.$new();
            tempscope.turno = turno;
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
        $this.openSesionEditModal = function (sesion) {
            var modalHtml = "<md-dialog aria-label=\"Paciente\" md-draggable>\n                                <md-toolbar>\n                                    <div class=\"md-toolbar-tools  badge-warning\">\n                                        <h5 class=\"modal-title\">Cambiar Turno</h5>\n                                    </div>\n                                </md-toolbar>\n                                <sesion-edit-modal sesion=\"sesion\" on-save=\"answer\" on-cancel=\"cancel\" />\n                            </md-dialog>";
            var tempscope = $rootScope.$new();
            tempscope.sesion = sesion;
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
})();
//# sourceMappingURL=ModalComponentService.js.map