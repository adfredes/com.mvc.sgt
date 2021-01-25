(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("messageService", ['$mdDialog', messageController]);
    function messageController($mdDialog) {
        var $this = this;
        $this.Notify = function (title, message, parentEl) {
            var notify = $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ariaLabel('Alert Dialog')
                .ok('Aceptar')
                .multiple(true);
            return $mdDialog.show(notify);
        };
        $this.showConfirm = function (title, message, okText, cancelText, parentEl) {
            var confirm = $mdDialog.confirm()
                .title(title)
                .textContent(message)
                .ariaLabel('Confirm Dialog')
                .ok(okText)
                .cancel(cancelText);
            return $mdDialog.show(confirm);
        };
    }
})();
//# sourceMappingURL=MessageService.js.map