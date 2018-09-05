sgtApp.controller("pacienteController", ['$scope', '$filter', 'crudService', pacienteController])

function pacienteController($scope, $filter, crudService) {

    $scope.PacienteModel = {};

    $scope.Save = function () {
        var requestResponse = crudService.CreateOrEdit($scope.PacienteModel, 'Paciente');
    }


}