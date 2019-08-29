(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller("pacienteController", ['$scope', '$filter', 'crudService', function ($scope, $filter, crudService) {
            $scope.currentPage = 0;
            $scope.initPage = 0;
            $scope.pageSize = 10;
            $scope.registerCount = 0;
            $scope.pacientes = [];
            $scope.pages = [];
            $scope.arrayLetter = ["TODOS", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            $scope.selectedLetter = 'TODOS';
            $scope.PacienteModel = {};
            $scope.getProvincias = function () {
                var _url = 'api/Provincia/All';
                var requestResponse = crudService.GetHttp(_url);
                var provincias = [];
                requestResponse.then(function (response) {
                    provincias = response.data;
                }, function () {
                    var provincias = [];
                });
                return provincias;
            };
            $scope.setLetter = function (letter) {
                $scope.selectedLetter = letter;
                $scope.setPage(0);
            };
            $scope.setPage = function (page) {
                $scope.currentPage = page;
                if ($scope.currentPage < $scope.initPage) {
                    $scope.initPage = $scope.currentPage;
                }
                if ($scope.currentPage > ($scope.initPage + 9)) {
                    $scope.initPage = $scope.currentPage;
                }
                $scope.GetPacientes();
                if ($scope.currentPage == ($scope.pages.length - 1)) {
                    $scope.initPage = $scope.currentPage - 9;
                }
                $scope.initPage = $scope.initPage < 0 ? 0 : $scope.initPage;
            };
            $scope.Save = function (newPaciente) {
                if (newPaciente) {
                    $scope.PacienteModel = newPaciente;
                    $scope.GetPacientes();
                }
            };
            $scope.Edit = function (id) {
                $scope.PacienteModel = { ID: id };
            };
            $scope.Create = function () {
                $scope.PacienteModel = {};
            };
            $scope.GetPacientes = function () {
                var _url = '';
                if ($scope.selectedLetter == 'TODOS') {
                    _url = 'paciente/Listar/' + ($scope.currentPage + 1) + '/' + $scope.pageSize;
                }
                else {
                    _url = 'paciente/Listar/' + $scope.selectedLetter + '/' + ($scope.currentPage + 1) + '/' + $scope.pageSize;
                }
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    var data = JSON.parse(response.data);
                    $scope.registerCount = data.count;
                    $scope.pacientes = data.list;
                    $scope.pages = [];
                    for (x = 0; (x * $scope.pageSize) < $scope.registerCount; x++) {
                        $scope.pages.push(x + 1);
                    }
                }, function () {
                    $scope.pages = [];
                    $scope.pacientes = [];
                });
            };
            function Message(requestResponse) {
                requestResponse.then(function successCallback(response) {
                    $scope.PacienteModel = {};
                    $scope.GetPacientes();
                    $('#CreateOrUpdate').modal('hide');
                }, function errorCallback(response) {
                });
            }
            function ToJavaScriptDate(value) {
                var pattern = /Date\(([^)]+)\)/;
                var results = pattern.exec(value);
                var dt = new Date(parseFloat(results[1]));
                return dt;
            }
        }
    ]);
})();
//# sourceMappingURL=PacienteController.js.map