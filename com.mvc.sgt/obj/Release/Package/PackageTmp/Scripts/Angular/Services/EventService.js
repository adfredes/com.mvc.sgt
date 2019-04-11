(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("eventService", eventServiceController);

    function eventServiceController() {
        var $this = this;

        $this.UpdateTurnos = () => {
            let event = document.createEvent('Event');
            event.initEvent('UpdateTurnos', true, true);
            document.dispatchEvent(event);
        };
    }
}
)();