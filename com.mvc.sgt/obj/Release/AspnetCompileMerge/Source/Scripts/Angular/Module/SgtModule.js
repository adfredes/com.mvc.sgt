(function () {    
    //window.Domain = 'http://localhost:52316/';
    window.Domain = window.location.origin + '/';
    //window.Domain = 'http://sitk.socialpics.com.ar/';    
    var sgtApp = angular.module("sgtApp", ['ngRoute', 'ngMaterial', 'ngAnimate', 'ngMessages','ngSanitize']);
    

    //sgtApp.run(function ($mdDateLocale, $filter) {
    //    $mdDateLocale.formatDate = function (date) {
    //        return angular.isDate(date)? $filter('date')(date, "dd/MM/yyyy") : null;
    //    };
    //});

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
            })
            ;

    }]);

    sgtApp.config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return date ? moment(date).format('DD/MM/YYYY') : '';
        };

        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);            
            return m.isValid() ? m.toDate() : new Date(NaN);
        };

        //$mdDateLocaleProvider.isDateComplete = function (dateString) {
        //    dateString = dateString.trim();
        //    // Look for two chunks of content (either numbers or text) separated by delimiters.
        //    var re = /^(([a-zA-Z]{3,}|[0-9]{1,4})([ .,]+|[/-]))([a-zA-Z]{3,}|[0-9]{1,4})/;
        //    return re.test(dateString);
        //};
    }]);

    sgtApp.animation('.slide', [function () {
        return {
            // make note that other events (like addClass/removeClass)
            // have different function input parameters
            enter: function (element, doneFn) {
                jQuery(element).fadeIn(1000, doneFn);

                // remember to call doneFn so that AngularJS
                // knows that the animation has concluded
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
