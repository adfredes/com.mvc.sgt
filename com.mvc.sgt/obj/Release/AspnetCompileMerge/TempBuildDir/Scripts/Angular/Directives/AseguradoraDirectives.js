(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.directive('aseguradoraEdit', ['crudService', function (crudService) {
        return {
            scope: {
                aseguradora: "=",
                save: "="
            },
            templateUrl: Domain + 'Aseguradora/CreateOrEdit',
            controller: ['$scope', 'crudService', '$window', '$mdSelect', function ($scope, crudService, $window, $mdSelect) {

                $scope.planEdit = -1;

                $scope.setEditMode = function (rowId) {
                    $scope.planEdit = rowId;
                }

                $scope.close = function () {
                    $scope.setEditMode(-1);
                    $scope.frmAseguradora.$setPristine();
                    $scope.frmAseguradora.$setUntouched();
                }

                $scope.setTouch = function () {
                    angular.forEach($scope.frmAseguradora.$error, (field) => angular.forEach(field, (errorField) => {
                        errorField.$setTouched()
                    }));
                }

                $scope.planModel = { Descripcion: "" };

                $scope.AgregarPlan = function () {
                    $scope.planModel.Habilitado = true;
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

                $scope.saveForm = function () {
                    $scope.setEditMode(-1);
                    $scope.save();
                }
            }],
            link: function (s, e, a) {

            }
        }
    }]);
})();
