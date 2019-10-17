(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.directive("webcam", function () {
        return {
            template: "<div>\n\t\t\t<video id=\"videoFoto\" class=\"img-fluid\" ng-show=\"takeFoto\" autoplay></video>\n            <img class=\"img-fluid p-1\" ng-hide=\"takeFoto\" ng-src=\"{{base64?base64:'../content/addphoto-camera.svg'}}\"/>\n            <canvas id=\"canvasFoto\" ng-hide=\"1==1\"></canvas>\n            <span ng-hide=\"takeFoto\" class=\"md-button\" ng-click=\"takingFoto()\">Tomar Foto</span>\n            <span ng-show=\"takeFoto\" class=\"md-button\" ng-click=\"take()\">Capturar</span>\n\t\t    </div>",
            scope: {
                onTake: '&?',
                base64: '<?'
            },
            link: function postLink(scope, element) {
                scope.takeFoto = false;
                var video, canvas, canvasContext;
                scope.takingFoto = function () {
                    scope.takeFoto = true;
                    video = angular.element(element).find('video')[0];
                    canvas = angular.element(element).find('canvas')[0];
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(function (stream) {
                            video.srcObject = stream;
                            video.play();
                        });
                    }
                };
                scope.take = function () {
                    var imgB64;
                    canvas.setAttribute('width', video.videoWidth);
                    canvas.setAttribute('height', video.videoHeight);
                    canvasContext = canvas.getContext('2d');
                    canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
                    scope.takeFoto = false;
                    scope.base64 = canvas.toDataURL('image/jpeg', 0.5);
                    imgB64 = canvas.toDataURL('image/jpeg', 0.5);
                    if (scope.onTake && canvas) {
                        scope.onTake({ data: imgB64 });
                    }
                };
            }
        };
    });
})();
//# sourceMappingURL=WebCamDirectives.js.map