(function (app) {
    var sgtApp = angular.module("sgtApp");
    sgtApp.directive('mdDraggable', [function () {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs) {
                    var initialMouseX, initialMouseY, ttX, ttY;
                    var ttXX = 0;
                    var ttYY = 0;
                    elm.prop('draggable', true);
                    elm.css({ position: 'absolute' });
                    elm.on('dragstart', function ($event) {
                        ttX = 0;
                        ttY = 0;
                        initialMouseX = $event.clientX;
                        initialMouseY = $event.clientY;
                        elm.on('mouseleave', mouseup);
                        elm.on('mouseup', mouseup);
                        elm.on('mousemove', mousemove);
                        return false;
                    });
                    function mousemove($event) {
                        var dx = $event.clientX - initialMouseX + ttXX;
                        var dy = $event.clientY - initialMouseY + ttYY;
                        ttX = $event.clientX - initialMouseX;
                        ttY = $event.clientY - initialMouseY;
                        var ttl = 'translate(' + dx + 'px,' + dy + 'px)';
                        elm.css({
                            transform: ttl
                        });
                        return false;
                    }
                    function mouseup() {
                        elm.off('mousemove', mousemove);
                        elm.off('mouseleave', mouseup);
                        elm.off('mouseup', mouseup);
                        if (ttY && ttX) {
                            ttYY += ttY;
                            ttXX += ttX;
                        }
                        ttY = undefined;
                        ttX = undefined;
                    }
                }
            };
        }]);
})(window.module);
//# sourceMappingURL=MdDraggableDirective.js.map