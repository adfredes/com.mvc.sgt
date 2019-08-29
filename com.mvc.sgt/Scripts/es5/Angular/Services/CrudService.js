(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("crudService", ['$http', '$q', crudServiceController]);
    function crudServiceController($http, $q) {
        var $this = this;
        $this.CreateOrEdit = function (entity, controlador) {
            return $http({
                method: 'POST',
                url: Domain + controlador + '/CreateOrEdit',
                data: JSON.stringify(entity),
                datatype: 'json'
            });
        };
        $this.GetAll = function (controlador) {
            return $http({
                method: 'GET',
                url: Domain + controlador + '/GetAll'
            });
        };
        $this.Get = function (id, controlador) {
            return $http({
                method: 'GET',
                url: Domain + controlador + '/Get/' + id
            });
        };
        $this.GetAllPaging = function (controlador, page, size) {
            return $http({
                method: 'GET',
                url: Domain + controlador + '/Listar/' + page + '/' + size
            });
        };
        $this.GetHttp = function (_url) {
            return $http({
                method: 'GET',
                url: Domain + _url
            });
        };
        $this.GetPHttp = function (_url) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({ method: 'GET', url: Domain + _url })
                .then(function (response) {
                defered.resolve(response.data);
            }, function (err) {
                defered.reject(err);
            });
            return promise;
        };
        $this.PostHttp = function (_url, data) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'Post',
                url: Domain + _url,
                data: JSON.stringify(data),
                datatype: 'json'
            })
                .then(function (response) { defered.resolve(response.data); }, function (err) { defered.reject(err); });
            return promise;
        };
        $this.PutHttp = function (_url, data) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'PUT',
                url: Domain + _url,
                data: JSON.stringify(data),
                datatype: 'json'
            })
                .then(function (response) { defered.resolve(response.data); }, function (err) { defered.reject(err); });
            return promise;
        };
        $this.DeleteHttp = function (_url, data) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'DELETE',
                url: Domain + _url
            })
                .then(function (response) { defered.resolve(response.data); }, function (err) { defered.reject(err); });
            return promise;
        };
        $this.GetPHttpParse = function (_url) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({ method: 'GET', url: Domain + _url })
                .then(function (response) {
                defered.resolve(JSON.parse(response.data));
            }, function (err) {
                defered.reject(err);
            });
            return promise;
        };
    }
})();
//# sourceMappingURL=CrudService.js.map