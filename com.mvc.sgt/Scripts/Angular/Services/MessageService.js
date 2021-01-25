(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("messageService", ['$mdDialog',messageController]);

    function messageController($mdDialog) {
        let $this = this;

        $this.Notify = (title, message, parentEl) => {
            let notify = $mdDialog.alert()
                .parent(angular.element(document.body))
                //.parent(parentEl.children())
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ariaLabel('Alert Dialog')
                .ok('Aceptar')
                .multiple(true);

            return $mdDialog.show(notify);
        };

        $this.showConfirm = function (title, message, okText, cancelText, parentEl) {
            // Appending dialog to document.body to cover sidenav in docs app
            let confirm = $mdDialog.confirm()
                .title(title)
                .textContent(message)
                .ariaLabel('Confirm Dialog')                
                .ok(okText)
                .cancel(cancelText);
            return $mdDialog.show(confirm);
        };
    }
}
)();