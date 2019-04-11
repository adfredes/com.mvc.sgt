(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("crudService", ['$http', '$q', crudServiceController]);

    function crudServiceController($http, $q) {
        var $this = this;

        $this.CreateOrEdit = (entity, controlador) =>
            $http({
                method: 'POST',
                url: Domain + controlador + '/CreateOrEdit',
                data: JSON.stringify(entity),
                datatype: 'json'
            });


        $this.GetAll = (controlador) =>
            $http({
                method: 'GET',
                url: Domain + controlador + '/GetAll'
            });


        $this.Get = (id, controlador) =>
            $http({
                method: 'GET',
                url: Domain + controlador + '/Get/' + id
            });


        $this.GetAllPaging = (controlador, page, size) =>
            $http({
                method: 'GET',
                url: Domain + controlador + '/Listar/' + page + '/' + size
            });


        $this.GetHttp = (_url) =>
            $http({
                method: 'GET',
                url: Domain + _url
            });


        $this.GetPHttp = (_url) => {
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

        $this.PostHttp = (_url, data) => {
            let defered = $q.defer();
            let promise = defered.promise;
            $http({
                method: 'Post',
                url: Domain + _url,
                data: JSON.stringify(data),
                datatype: 'json'
            })
                .then(
                function (response) { defered.resolve(response.data); },
                function (err) { defered.reject(err); }
                );
            return promise;
        };

        $this.PutHttp = (_url, data) => {
            let defered = $q.defer();
            let promise = defered.promise;
            $http({
                method: 'PUT',
                url: Domain + _url,
                data: JSON.stringify(data),
                datatype: 'json'
            })
                .then(
                function (response) { defered.resolve(response.data); },
                function (err) { defered.reject(err); }
                );
            return promise;
        };

        $this.GetPHttpParse = (_url) => {
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