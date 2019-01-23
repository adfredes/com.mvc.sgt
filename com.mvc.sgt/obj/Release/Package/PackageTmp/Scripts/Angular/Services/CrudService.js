(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("crudService", ['$http', '$q', function ($http, $q) {

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

        $this.GetAllPaging = function (controlador, page, size) {
            var request = $http({
                method: 'GET',
                url: Domain + controlador + '/Listar/' + page + '/' + size
            });
            return request;
        }

        $this.GetHttp = function (_url) {
            var request = $http({
                method: 'GET',
                url: Domain + _url
            });
            return request;
        }

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
        }

        $this.PostHttp = function (_url, data) {
            let defered = $q.defer();
            let promise = defered.promise;
            $http({
                method: 'Post',
                url: Domain + _url,
                data: JSON.stringify(data),
                datatype: 'json'
            })
                .then(
                    function (response) { defered.resolve(response.data) },
                    function (err) { defered.reject(err) }
            );
            return promise;
        }

    }]);
})();