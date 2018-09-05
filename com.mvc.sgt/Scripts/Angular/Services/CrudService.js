/*sgtApp.service("CrudService", ['$http', function ($http) {
    

    var $this = this;

    $this.CreateOrEdit = function (entity) {
        var request = $http({
            method: 'POST',
            url: Domain + 'Aseguradora/CreateOrEdit',
            data: JSON.stringify(entity),
            datatype: 'json'
        });
        return request;
    }

    $this.GetAll = function () {
        console.log("GetAllService");
        var request = $http({
            method: 'GET',
            url: Domain + 'Aseguradora/GetAll'
        });
        return request;
    }

    $this.Get = function (id) {
        var request = $http({
            method: 'GET',
            url: Domain + 'Aseguradora/Get/' + id
        });
        return request;
    }
}]);*/

sgtApp.service("crudService", ['$http',function ($http) {

    var $this = this;
    $this.CreateOrEdit = function (entity, controlador) {
        var request = $http({
            method: 'POST',
            url: Domain + controlador + '/CreateOrEdit',
            data: JSON.stringify(entity),
            datatype: 'json'
        });
        return request;
    }

    $this.GetAll = function (controlador) {        
        var request = $http({
            method: 'GET',
            url: Domain + controlador + '/GetAll'
        });
        return request;
    }

    $this.Get = function (id, controlador) {
        var request = $http({
            method: 'GET',
            url: Domain + controlador + '/Get/' + id
        });
        return request;
    }
    
}]);