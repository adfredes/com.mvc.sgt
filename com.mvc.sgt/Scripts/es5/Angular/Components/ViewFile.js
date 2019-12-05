(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.component('viewFile', {
        template: "<iframe id='viewFileFrame' style='width:100%;height:100%; text-align:center;'></iframe>\n",
        controller: ['crudService', viewFileController],
        bindings: {
            fileId: "@"
        }
    });
    function viewFileController(crudService) {
        var vm = this;
        vm.$onInit = function () {
            var _url = "Paciente/File/" + vm.fileId;
            var promise = crudService.GetPHttp(_url);
            promise.then(function (data) {
                vm.url = URL.createObjectURL(dataURLtoBlob(data.Archivo));
                window.document.querySelector('#viewFileFrame').src = vm.url;
            })
                .catch(function (error) { return error = []; });
        };
        function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    }
})();
//# sourceMappingURL=ViewFile.js.map