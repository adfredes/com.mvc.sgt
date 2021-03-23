(function () {
    window.Domain = window.location.origin + '/';
    var sgtApp = angular.module("sgtApp", ['ngRoute', 'ngMaterial', 'ngAnimate', 'ngMessages', 'ngSanitize']);
    sgtApp.config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/Pacientes', {
                templateUrl: window.Domain + 'Paciente'
            })
                .when('/Agenda', {
                templateUrl: window.Domain + 'Agenda'
            })
                .when('/Aseguradoras', {
                templateUrl: window.Domain + 'Aseguradora'
            })
                .when('/Feriados', {
                templateUrl: window.Domain + 'Agenda/Feriados'
            })
                .when('/Consultorios', {
                templateUrl: window.Domain + 'Consultorio'
            })
                .when('/Profesionales', {
                templateUrl: window.Domain + 'Profesional'
            })
                .when('/Turnos', {
                templateUrl: window.Domain + 'Agenda/Semanal'
            });
        }]);
    sgtApp.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function (date) {
                return date ? moment(date).format('DD/MM/YYYY') : '';
            };
            $mdDateLocaleProvider.parseDate = function (dateString) {
                var m = moment(dateString, 'DD/MM/YYYY', true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            };
        }]);
    sgtApp.animation('.slide', [function () {
            return {
                enter: function (element, doneFn) {
                    jQuery(element).fadeIn(1000, doneFn);
                },
                move: function (element, doneFn) {
                    jQuery(element).fadeIn(1000, doneFn);
                },
                leave: function (element, doneFn) {
                    jQuery(element).fadeOut(1000, doneFn);
                }
            };
        }]);
    sgtApp.animation('.repeated-item', function () {
        return {
            enter: function (element, done) {
                element.css('opacity', 0);
                element.animate({ opacity: 1 }, done);
                return function (isCancelled) {
                    if (isCancelled) {
                        element.stop();
                    }
                };
            },
            leave: function (element, done) {
                element.css('opacity', 1);
                element.animate({ opacity: 0 }, done);
                return function (isCancelled) {
                    if (isCancelled) {
                        element.stop();
                    }
                };
            },
            move: function (element, done) { },
            addClass: function (element, className, done) { },
            removeClass: function (element, className, done) { }
        };
    });
})();
//# sourceMappingURL=SgtModule.js.map