(function () {
    var sgtApp = angular.module("sgtApp");
    
    sgtApp.component('searchPaciente', {        
        templateUrl: Domain + '/Paciente/QuickSearch',
        controller: ['crudService', '$mdDialog',searchPacienteController],
        transclude: true,
        bindings: {
            addEnabled: "@?",
            viewEnabled: "@?", 
            addQuick: "@?",
            onChange: "&?",
            onAdd: "&?"
        }
    });

    function searchPacienteController(crudService, $mdDialog) {
        var vm = this;
        
        vm.$onInit = () => {
            vm.searchText = '';
            vm.select = {};
            vm.addEnabled = vm.addEnabled ? true : false;
            vm.viewEnabled = vm.viewEnabled ? true : false;
        };

        vm.search = function () {

            let _url = 'Paciente/Listar/Name/' + vm.searchText;

            var promesa = crudService.GetPHttpParse(_url);
            return promesa;

            //Paciente/Listar/Name/
        };

        vm.changeSelectedItem = () => {                        
            if (vm.onChange) {
                let data = vm.Paciente;
                vm.onChange()(data);
            }
            else {
                if (vm.Paciente) {
                    $('#ViewPaciente').modal('show');
                }                
            }
        };

        vm.clear = () => vm.Paciente = {};
        /*vm.UpdateDate = function () {
            if (vm.Paciente && vm.Paciente.FechaNacimiento)
                vm.Paciente.FechaNacimiento = moment(vm.Paciente.FechaNacimiento).toDate();
        };*/

        //pacienteQuickCreate
        

        vm.openQuickCreate = () => {
            let modalHtml = `<md-dialog aria-label="Paciente">
                                <md-toolbar>
                                    <div class="md-toolbar-tools  badge-warning">
                                        <h5 class="modal-title">Nuevo Paciente</h5>
                                    </div>
                                </md-toolbar>
                                <paciente-quick-create on-save="answer" on-cancel="cancel" />
                            </md-dialog>`;

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
                template: modalHtml,
                controller: ['$scope', '$mdDialog', DialogController],
                clickOutsideToClose: true,
                fullscreen: false
                //,
                //locals: { turno: turno }
            })
                .then(answer => {
                                       
                })
                .catch(() => undefined);
        };

    }

})();