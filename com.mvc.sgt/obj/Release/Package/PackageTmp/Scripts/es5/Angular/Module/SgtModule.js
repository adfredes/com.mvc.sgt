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
})();
//# sourceMappingURL=SgtModule.js.map