﻿(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('navbarController', navbarController);

    function navbarController() {
        var vm = this;

        

        vm.changeLink = function (link) {
            vm.activeLink = link;
            let div = document.querySelector('#divAusenciasGrilla');
            if (div) {
                div.innerHTML = '';
            }
        };
        
    }
})();