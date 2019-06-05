(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.directive('pacienteEdit', [function () {
            return {
                scope: {
                    paciente: "<",
                    save: "=",
                    divId: "@"
                },
                templateUrl: Domain + 'Paciente/CreateOrEdit',
                controller: ['$scope', 'crudService', '$window', '$mdSelect', function ($scope, crudService, $window, $mdSelect) {
                        $window.document.addEventListener('click', function (e) {
                            e.stopImmediatePropagation();
                            if (!(e.target.nodeName === 'MD-SELECT' || e.target.nodeName === 'SPAN')) {
                                $mdSelect.hide();
                            }
                        });
                        $scope.MdHide = function () {
                            $mdSelect.destroy();
                        };
                        if (!$scope.paciente) {
                            $scope.paciente = {};
                        }
                        getProvincias();
                        getObrasSociales();
                        $scope.Provincias = [];
                        $scope.Localidades = [];
                        $scope.$watch('paciente.ProvinciaID', function () {
                            if ($scope.paciente) {
                                if ($scope.paciente.ProvinciaID) {
                                    $scope.getLocalidades();
                                }
                            }
                        });
                        function getProvincias() {
                            var _url = 'api/provincia/all/cmb';
                            var requestResponse = crudService.GetHttp(_url);
                            requestResponse.then(function (response) {
                                $scope.Provincias = response.data;
                                if (!$scope.paciente.ProvinciaID) {
                                    $scope.paciente.ProvinciaID = $scope.Provincias[0].Value;
                                }
                            }, function () {
                                $scope.Provincias = [];
                            });
                        }
                        $scope.getLocalidades = function () {
                            var _url = 'api/provincia/' + $scope.paciente.ProvinciaID + '/localidad/all/cmb';
                            var requestResponse = crudService.GetHttp(_url);
                            requestResponse.then(function (response) {
                                $scope.Localidades = response.data;
                            }, function () {
                                $scope.Localidades = [];
                            });
                        };
                        $scope.ObrasSociales = [];
                        $scope.Planes = [];
                        $scope.$watch('paciente.AseguradoraID', function () {
                            if ($scope.paciente) {
                                if ($scope.paciente.AseguradoraID) {
                                    $scope.getPlanes();
                                }
                            }
                        });
                        function getObrasSociales() {
                            var _url = 'api/aseguradora/all/cmb';
                            var requestResponse = crudService.GetHttp(_url);
                            requestResponse.then(function (response) {
                                $scope.ObrasSociales = response.data;
                                if (!$scope.paciente.AseguradoraID) {
                                    $scope.paciente.AseguradoraID = $scope.ObrasSociales[0].Value;
                                }
                            }, function () {
                                $scope.ObrasSociales = [];
                            });
                        }
                        ;
                        $scope.getPlanes = function () {
                            var _url = 'api/aseguradora/' + $scope.paciente.AseguradoraID + '/plan/all/cmb';
                            var requestResponse = crudService.GetHttp(_url);
                            requestResponse.then(function (response) {
                                $scope.Planes = response.data;
                            }, function () {
                                $scope.Planes = [];
                            });
                        };
                        $scope.isValidDate = function (date) {
                            return angular.isDate();
                        };
                        $scope.close = function () {
                            $scope.frmPaciente.$setPristine();
                            $scope.frmPaciente.$setUntouched();
                        };
                        $scope.setTouch = function () {
                            angular.forEach($scope.frmPaciente.$error, function (field) { return angular.forEach(field, function (errorField) {
                                errorField.$setTouched();
                            }); });
                        };
                        $scope.savePaciente = function () {
                            $scope.setTouch();
                            if ($scope.frmPaciente.$valid) {
                                $scope.save();
                                $scope.close();
                            }
                        };
                    }],
                link: function (s, e, a) { }
            };
        }]);
})();
//# sourceMappingURL=PacienteDirectives.js.map