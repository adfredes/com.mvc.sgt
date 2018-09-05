
sgtApp.directive('aseguradoraEdit',['crudService', function (crudService) {
    return {        
        scope: {
            aseguradora: "=",
            save: "="},
        templateUrl: Domain + 'Aseguradora/CreateOrEdit',
        controller: ['$scope', function ($scope) {
            $scope.planModel = {Descripcion: ""};

            $scope.AgregarPlan = function () {                
                $scope.aseguradora.AseguradoraPlan.push($scope.planModel)
                $scope.planModel = { Descripcion: "" };
            }

            $scope.EliminarPlan = function (plan, index) {
                if (!plan.ID) {
                    $scope.aseguradora.AseguradoraPlan.splice(index, 1);
                }
                else {
                    if (plan.Habilitado) {
                        plan.Habilitado = false;
                    }                    
                }
            }
        }],
        link: function (s, e, a) {}
    }
}]);