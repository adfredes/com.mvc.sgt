(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("modalComponentService", ['$rootScope', '$mdDialog', modalComponentServiceController]);

    function modalComponentServiceController($rootScope, $mdDialog) {
        var $this = this;

        $this.openViewSesionesModal = (pacienteID, turnoID) => {
            let modalHtml = `

                            <md-dialog style="max-height:95%; max-width:80%;" md-draggable>                            
                            <sesiones-view paciente-id = "pacienteID" turno-id="turnoID" cancelar = "cancel()"></sesiones-view>
                            </md-dialog>


                    `;

            let tempscope = $rootScope.$new();
            tempscope.pacienteID = pacienteID;
            tempscope.turnoID = turnoID;
            tempscope.tile = 'TITULO';


            function DialogController($scope, $mdDialog) {
                //$scope.pacienteId = $event.originalEvent.detail.valor;

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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: true,
                autoWrap: false,
                scope: tempscope,
                multiple: true
                //preserveScope: true                        
            })
                .then(answer => {
                    success(answer);
                })
                .catch(() => { });
        };

        $this.openDatosSesionesModal = (pacienteID, turnoID) => {
            let modalHtml = `

                            <md-dialog style="max-height:95%; max-width:80%;min-width:50%;" md-draggable>
                            <datos-sesiones paciente-id = "pacienteID" turno-id="turnoID" cancelar = "cancel()"></datos-sesiones>
                            </md-dialog>


                    `;

            let tempscope = $rootScope.$new();
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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: true,
                autoWrap: false,
                scope: tempscope,
                multiple: true
                //preserveScope: true                        
            })
                .then(answer => {
                    success(answer);
                })
                .catch(() => { });
        };

        $this.openPacienteModal = (pacienteID) => {
            let modalHtml = `

                            <md-dialog style="max-height:95%; width:60%;" md-draggable>
                            <paciente-view paciente = "pacienteID" cancelar = "cancel()"></paciente-view>
                            </md-dialog>


                    `;

            let tempscope = $rootScope.$new();
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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: true,
                autoWrap: false,
                scope: tempscope,
                multiple: true
                //preserveScope: true                        
            })
                .then(answer => {
                    success(answer);
                })
                .catch(() => { });
        };

        $this.openAsignarPacienteModal = (turno) => {
            let modalHtml = `

                            <md-dialog style="max-height:95%; min-width:40%;" md-draggable>
                            <asignar-paciente turno = "turno" cancelar = "cancel()"></asignar-paciente>
                            </md-dialog>


                    `;

            let tempscope = $rootScope.$new();
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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: true,
                autoWrap: false,
                scope: tempscope,
                multiple: true
                //preserveScope: true                        
            })
                .then(answer => {
                    success(answer);
                })
                .catch(() => { });
        };

        $this.openSesionEditModal = (sesion) => {
            let modalHtml = `<md-dialog aria-label="Paciente" md-draggable>
                                <md-toolbar>
                                    <div class="md-toolbar-tools  badge-warning">
                                        <h5 class="modal-title">Cambiar Turno</h5>
                                    </div>
                                </md-toolbar>
                                <sesion-edit-modal sesion="sesion" on-save="answer" on-cancel="cancel" />
                            </md-dialog>`;


            let tempscope = $rootScope.$new();
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
                parent: angular.element(document.body),//parent: angular.element(document.body),
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: false,
                fullscreen: true,
                autoWrap: false,
                scope: tempscope,
                multiple: true
                //preserveScope: true                        
            })
                .then(answer => {
                    success(answer);
                })
                .catch(() => { });
        };
    }
}
)();