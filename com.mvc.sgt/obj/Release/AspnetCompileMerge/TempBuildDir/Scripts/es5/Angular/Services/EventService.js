(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("eventService", eventServiceController);
    function eventServiceController() {
        var $this = this;
        $this.UpdateTurnos = function () {
            var event = document.createEvent('Event');
            event.initEvent('UpdateTurnos', true, true);
            document.dispatchEvent(event);
        };
    }
})();
//# sourceMappingURL=EventService.js.map