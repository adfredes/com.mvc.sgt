(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.controller('navbarController', navbarController);

    function navbarController() {
        var vm = this;

        

        vm.changeLink= function (link){
            console.log("ok");
            vm.activeLink = link;
        }
        console.log(vm.activeLink);
    }
})();