(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('consultorioController', ['crudService', consultorioController]);
    function consultorioController(crudService) {
        var vm = this;
        vm.consultorio = {};
        vm.GetConsultorios = function () {
            var _url = 'Consultorio/Listar';
            crudService.GetPHttp(_url)
                .then(function (data) { return vm.consultorios = data; })
                .catch(function (err) { return vm.consultorios = []; });
        };
        vm.Edit = function (data) {
            vm.consultorio = data;
        };
        vm.Create = function () {
            vm.consultorio = {};
            vm.consultorio.Habilitado = true;
            vm.consultorio.TurnosSimultaneos = 1;
        };
    }
})();
//# sourceMappingURL=ConsultorioController.js.map