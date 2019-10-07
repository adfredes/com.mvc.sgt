(function () {
    var sgtApp = angular.module("sgtApp");

    sgtApp.component('agendaEdit', {
        templateUrl: Domain + '/Agenda/Edit',
        controller: ['crudService', agendaEditController],
        bindings: {
            agenda: "<",
            onSave: "&?"
        }
    });

    function agendaEditController(crudService) {
        var vm = this;
        vm.error = "";

        vm.changeHour = () => console.dir(vm.agenda);

        vm.save = function (data) {
            
            
            console.dir(data);
            var promise = crudService.PutHttp('/Agenda/Edit', data);
            promise.then(function (data) {
                if (vm.onSave) {
                    vm.onSave()(vm.agenda);
                }
                $('#CreateOrUpdateAgenda').modal('hide');
            })
                .catch(function (error) {
                    vm.error = error.data;
                }
                );
        };

    }


})();