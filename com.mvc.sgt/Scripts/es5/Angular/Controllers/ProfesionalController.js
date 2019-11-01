(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller("profesionalController", ['messageService', '$scope', '$filter', 'crudService', '$element',
        function (messageService, $scope, $filter, crudService, $element) {
            $scope.currentPage = 0;
            $scope.initPage = 0;
            $scope.pageSize = 10;
            $scope.registerCount = 0;
            $scope.pacientes = [];
            $scope.pages = [];
            $scope.arrayLetter = ["TODOS", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            $scope.selectedLetter = 'TODOS';
            $scope.ProfesionalModel = {};
            (function () {
                var promise3 = crudService.GetPHttp('Agenda/Dias');
                promise3.then(function (data) {
                    $scope.diasSemana = data;
                })
                    .catch(function (err) {
                });
            })();
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
                $scope.GetProfesionales();
                if ($scope.currentPage == ($scope.pages.length - 1)) {
                    $scope.initPage = $scope.currentPage - 9;
                }
                $scope.initPage = $scope.initPage < 0 ? 0 : $scope.initPage;
            };
            $scope.Delete = function (profesional) {
                messageService.showConfirm("Profesionales", "Esta seguro que desea eliminar a " + profesional.Apellido + " " + profesional.Nombre + "?", 'SI', 'NO', $element.children())
                    .then(function () {
                    var promise = crudService.PostHttp('/Profesional/DeleteProfesional', { id: profesional.ID });
                    promise.then(function (data) {
                        $scope.GetProfesionales();
                    })
                        .catch(function (error) {
                    });
                });
            };
            $scope.Edit = function (id) {
                var getData = crudService.Get(id, 'Profesional');
                getData.then(function (response) {
                    response.data = JSON.parse(response.data);
                    $scope.ProfesionalModel = response.data;
                    if (!$scope.ProfesionalModel.Agenda || !$scope.ProfesionalModel.Agenda[0]) {
                        $scope.ProfesionalModel.Agenda.push({});
                    }
                    else {
                        $scope.ProfesionalModel.Agenda[0].HoraDesde = moment($scope.ProfesionalModel.Agenda[0].HoraDesde).toDate();
                        $scope.ProfesionalModel.Agenda[0].HoraHasta = moment($scope.ProfesionalModel.Agenda[0].HoraHasta).toDate();
                    }
                }, function () {
                    alert('Error al obtener los registros');
                });
            };
            $scope.Create = function () {
                $scope.ProfesionalModel = {};
                $scope.ProfesionalModel.Agenda = [];
                $scope.ProfesionalModel.Agenda.push({});
            };
            $scope.CreateAusencia = function (profesionalID) {
                $scope.ausencia = {
                    Habilitado: true,
                    FechaDesde: new Date(),
                    ProfesionalID: profesionalID
                };
            };
            $scope.GetProfesionales = function () {
                var _url = '';
                if ($scope.selectedLetter == 'TODOS') {
                    _url = 'Profesional/Listar/' + ($scope.currentPage + 1) + '/' + $scope.pageSize;
                }
                else {
                    _url = 'Profesional/Listar/' + $scope.selectedLetter + '/' + ($scope.currentPage + 1) + '/' + $scope.pageSize;
                }
                var requestResponse = crudService.GetHttp(_url);
                requestResponse.then(function (response) {
                    response.data = JSON.parse(response.data);
                    $scope.registerCount = response.data.count;
                    $scope.profesionales = response.data.list;
                    $scope.pages = [];
                    for (x = 0; x * $scope.pageSize < $scope.registerCount; x++) {
                        $scope.pages.push(x + 1);
                    }
                }, function () {
                    $scope.pages = [];
                    $scope.profesionales = [];
                });
            };
            function Message(requestResponse) {
                requestResponse.then(function successCallback(response) {
                    $scope.ProfesionalModel = {};
                    $scope.GetProfesionales();
                    $('#CreateOrUpdate').modal('hide');
                }, function errorCallback(response) {
                });
            }
        }
    ]);
})();
//# sourceMappingURL=ProfesionalController.js.map