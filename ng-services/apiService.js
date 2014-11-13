define(['ng', 'modelCarousel'], function(angular, modelCarousel) {

    'use strict';

    var jsonToUrlencoded = function ( data ) {
        var key, result = [];
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
        }
        return result.join("&");
    }

    modelCarousel.factory('apiService', ['$resource', '$http', '$q', 'apiServiceMocks',
        function($resource, $http, $q, apiServiceMocks) {

            var apiUrl = modelCarousel.appConfig.urls.api;

            if ( modelCarousel.appConfig.useMocks ) {
                apiServiceMocks.setupMocks();
            }

            var handleRequestSuccess = function(deferred, data) {
                if (data.responseInfo.code == 0) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            }

            var handleRequestFailure = function(deferred) {
                var response = {
                    "responseInfo": {
                        "code": 998,
                        "desc": "Service unavailable"
                    }
                };
                deferred.reject( response );
            }

            var withErrorHandling = function(obj) {

                console.log('withErrorHandling :', obj.title, obj.url, obj);

                var deferred = $q.defer();

                var request = {
                    method: obj.method,
                    url: apiUrl + obj.url
                };

                obj.method = obj.method.toUpperCase();

                if ( obj.method == 'POST' && typeof obj.data == 'object' ) {

                    if ( obj.contentType == 'form' ) {
                        request.headers = {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                        obj.data = jsonToUrlencoded(obj.data);
                    }

                    request.data = obj.data;

                } else if ( obj.method == 'GET' && typeof obj.params == 'object' ) {
                    request.params = obj.params;
                }

                console.log("apiService : doing $http request with", request)

                $http( request )
                    .success(function( data, status ) {
                        console.log(obj.title + ' DONE', data, status);
                        handleRequestSuccess( deferred, data );
                    })
                    .error(function( data, status ) {
                        console.log(obj.title + ' FAILED', data, status);
                        if ( typeof data.responseInfo == 'object' ) {
                            handleRequestSuccess( deferred, data );
                        } else {
                            handleRequestFailure( deferred );
                        }
                    });

                return deferred.promise;
            }

            return {
                withErrorHandling: withErrorHandling
            }
        }
    ]);
});