(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("messageService", ['$mdDialog', messageController]);
    function messageController($mdDialog) {
        var $this = this;
        $this.Notify = function (title, message, parentEl) {
            return $mdDialog.show($mdDialog.alert()
                .parent(parentEl.children())
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ariaLabel('Alert Dialog')
                .ok('Aceptar')
                .multiple(true));
        };
    }
})();
//# sourceMappingURL=MessageService.js.map