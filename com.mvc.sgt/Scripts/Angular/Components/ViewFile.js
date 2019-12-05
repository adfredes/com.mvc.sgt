(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.component('viewFile', {
        template: `<iframe id='viewFileFrame' style='width:100%;height:100%; text-align:center;'></iframe>
`,
        controller: ['crudService',viewFileController],
        bindings: {
            fileId: "@"
            
        }
    });

    function viewFileController(crudService) {
        let vm = this;                        

        //vm.$onChange = () => {            
        //    console.dir(vm.fileId);            
        //    let _url = `Paciente/File/4`;
        //    let promise = crudService.GetPHttp(_url);
        //    promise.then(data => {
        //        vm.url = URL.createObjectURL(dataURLtoBlob(data.Archivo));
        //        console.dir(vm.url);
        //    })
        //        .catch(error => error = []);
        //};      

        vm.$onInit = () => {                  
            let _url = `Paciente/File/${vm.fileId}`;
            let promise = crudService.GetPHttp(_url);
            promise.then(data => {
                vm.url = URL.createObjectURL(dataURLtoBlob(data.Archivo));
                window.document.querySelector('#viewFileFrame').src = vm.url;                
            })
                .catch(error => error = []);
                        
        };      

        function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    }


})();