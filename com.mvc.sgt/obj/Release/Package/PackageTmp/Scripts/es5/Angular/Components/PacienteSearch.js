(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('searchPaciente', {
        templateUrl: Domain + '/Paciente/QuickSearch',
        controller: ['crudService', '$mdDialog', searchPacienteController],
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
        vm.$onInit = function () {
            vm.searchText = '';
            vm.select = {};
            vm.addEnabled = vm.addEnabled ? true : false;
            vm.viewEnabled = vm.viewEnabled ? true : false;
        };
        vm.search = function () {
            var _url = 'Paciente/Listar/Name/' + vm.searchText;
            var promesa = crudService.GetPHttpParse(_url);
            return promesa;
        };
        vm.changeSelectedItem = function () {
            if (vm.onChange) {
                var data = vm.Paciente;
                vm.onChange()(data);
            }
            else {
                if (vm.Paciente) {
                    $('#ViewPaciente').modal('show');
                }
            }
        };
        vm.openViewPaciente = function () {
            console.dir(vm.Paciente);
            var selectedPaciente = JSON.parse(JSON.stringify(vm.Paciente));
            vm.Paciente = {};
            vm.Paciente = selectedPaciente;
            $('#ViewPaciente').modal('show');
        };
        vm.clear = function () { return vm.Paciente = {}; };
        vm.openQuickCreate = function () {
            var modalHtml = "<md-dialog aria-label=\"Paciente\">\n                                <md-toolbar>\n                                    <div class=\"md-toolbar-tools  badge-warning\">\n                                        <h5 class=\"modal-title\">Nuevo Paciente</h5>\n                                    </div>\n                                </md-toolbar>\n                                <paciente-quick-create on-save=\"answer\" on-cancel=\"cancel\" />\n                            </md-dialog>";
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
            })
                .then(function (answer) {
                vm.onAdd()(answer);
            })
                .catch(function () { return undefined; });
        };
    }
})();
//# sourceMappingURL=PacienteSearch.js.map