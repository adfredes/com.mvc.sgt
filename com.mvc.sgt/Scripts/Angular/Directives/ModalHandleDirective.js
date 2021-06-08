(function () {
    let sgtApp = angular.module("sgtApp");
    sgtApp.directive('modalHandle', ['modalComponentService', 'turnoService', 'eventService', function (modalComponentService, turnoService, eventService) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                
                elm.on('openmodal', $event => {     
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
                        case 'NumeroAutorizacion':
                            turnoService.openNumeroAutorizacion($event.originalEvent.detail.valor,
                                (promise) => promise.then(data => eventService.UpdateTurnos()),
                                document.body
                            );
                            break;
                        case 'CodigoTransaccion':
                            turnoService.openCodigoTransaccion($event.originalEvent.detail.valor,
                                (promise) => promise.then(data => eventService.UpdateTurnos()),
                                document.body
                            );
                            break;
                    }           
                });
                //datosSesiones

                let openViewSesionesModal = (pacienteID, turnoID) => {                                        
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
                        parent: angular.element(document.body),
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

                let openDatosSesionesModal = (pacienteID, turnoID) => {
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
                        parent: angular.element(document.body),
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

                let openPacienteModal = (pacienteID) => {
                    let modalHtml = `

                            <md-dialog style="max-height:95%; width:60%;" md-draggable>
                            <paciente-view paciente-id = "pacienteID" cancelar = "cancel()"></paciente-view>
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
                        parent: angular.element(document.body),
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
        };
    }]);
})();