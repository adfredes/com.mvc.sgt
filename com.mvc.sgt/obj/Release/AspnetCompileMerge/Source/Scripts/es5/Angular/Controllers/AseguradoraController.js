(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller("aseguradoraController", ['$scope', '$filter', 'crudService', function ($scope, $filter, crudService) {
            $scope.AseguradoraModel = {};
            $scope.AseguradoraModel.AseguradoraPlan = [];
            $scope.Save = function () {
                var requestResponse = crudService.CreateOrEdit($scope.AseguradoraModel, 'Aseguradora');
                Message(requestResponse);
            };
            $scope.Edit = function (id) {
                var getData = crudService.Get(id, 'Aseguradora');
                getData.then(function (response) {
                    $scope.AseguradoraModel = response.data;
                    $scope.AseguradoraModel.FechaModificacion = $filter('date')($scope.AseguradoraModel.FechaModificacion.substr(6, 13), 'dd/MM/yyyy HH:mm:ss');
                }, function () {
                    alert('Error al obtener los registros');
                });
            };
            $scope.Create = function () {
                $scope.AseguradoraModel = {};
                $scope.AseguradoraModel.AseguradoraPlan = [];
                $scope.AseguradoraModel.Color = "#ffffff";
            };
            $scope.GetAseguradoras = function () {
                $scope.aseguradoras = [];
                var requestResponse = crudService.GetAll('Aseguradora');
                requestResponse.then(function (response) {
                    $scope.aseguradoras = response.data;
                }, function () { });
            };
            function Message(requestResponse) {
                requestResponse.then(function successCallback(response) {
                    $scope.AseguradoraModel = {};
                    $scope.GetAseguradoras();
                    $('#CreateOrUpdate').modal('hide');
                }, function errorCallback(response) {
                });
            }
        }]);
})();
//# sourceMappingURL=AseguradoraController.js.map