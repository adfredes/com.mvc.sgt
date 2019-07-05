(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("messageService", ['$mdDialog',messageController]);

    function messageController($mdDialog) {
        let $this = this;

        $this.Notify = (title, message, parentEl) => {
            return $mdDialog.show(
                $mdDialog.alert()
                    .parent(parentEl.children())
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog')
                    .ok('Aceptar')
                    .multiple(true)
            );
        };
    }
}
)();