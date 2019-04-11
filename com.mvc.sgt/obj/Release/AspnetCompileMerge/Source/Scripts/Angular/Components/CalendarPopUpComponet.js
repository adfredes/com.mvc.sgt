(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('calendarPopUpController', [calendarPopUpController]);

    sgtApp.component('calendarPopup', {
        template: `<md-datepicker ng-model="$ctrl.fecha" md-placeholder="Fecha"
                    md-date-filter="ctrl.onlyWeeksPredicate"></md-datepicker>`,
        controller: 'feriadoEditController',
        bindings: {
            fecha: "="
        }
    });

    function calendarPopUpController() {
        let vm = this;
        vm.error = "";

        vm.onlyWeekendsPredicate = function (date) {
            var day = date.getDay();
            return day !== 0 && day !== 6;
        };

    }
})();