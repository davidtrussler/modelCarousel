define(['modelCarousel', 'ng-mocks'], function (modelCarousel, ngMock) {

    'use strict';

    modelCarousel.appConfig = {
        useMocks: false,
        urls: {}
    }

    var init = function () {

        var getRegexMatch = function( regex, string ) {
            var match = regex.exec( string );
            return match[1];
        };

        // Example:
        //   if
        //     window.location.href == "http://127.0.0.1:9090/audi-ui/myaudi-login.html#!/account/login",
        //   then:
        //     baseUrl = http://127.0.0.1:9090/
        //     appsUrl = http://127.0.0.1:9090/audi-ui/
        //     appUrl  = http://127.0.0.1:9090/audi-ui/myaudi-login.html

        var baseUrl = getRegexMatch( /(^http[s]?:\/\/[^\/]*\/)/gi, window.location.href ),
            appsUrl = getRegexMatch( /(^http[s]?:\/\/[^#]*\/)/gi,  window.location.href ),
            appUrl  = getRegexMatch( /(^http[s]?:\/\/[^#]*)/gi,    window.location.href );

        modelCarousel.appConfig.urls.base = baseUrl;
        modelCarousel.appConfig.urls.apps = appsUrl;
        modelCarousel.appConfig.urls.app  = appUrl;

        modelCarousel.appConfig.urls.api  = baseUrl + 'myaudi-public-api/services/v1/';

        modelCarousel.appConfig.urls.account = appsUrl + 'myaudi.html';
        modelCarousel.appConfig.urls.login   = appsUrl + 'myaudi-login.html';
        modelCarousel.appConfig.urls.messages = appsUrl + 'myaudi.html#!/myAudi/messages';
        modelCarousel.appConfig.urls.accountSettings = appsUrl + 'myaudi.html#!/myAudi/myDetails';

        if(window.console) console.log("appConfig :", modelCarousel.appConfig);

    };

    init();

    modelCarousel.config(['$httpProvider', function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

    modelCarousel.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix("!");
    }]);

    if ( modelCarousel.appConfig.useMocks ) {

        modelCarousel.config(['$provide', function ($provide) {

            $provide.decorator('$httpBackend', ngMock.e2e.$httpBackendDecorator);

            // Delay the mock ajax request to simulate the real thing
            $provide.decorator('$httpBackend', function ($delegate, $timeout) {
                var proxy = function (method, url, data, callback, headers) {
                    var interceptor = function () {
                        var _this = this,
                            _arguments = arguments;
                        $timeout(function () {
                            callback.apply(_this, _arguments);
                        }, 1000);
                    };
                    return $delegate.call(this, method, url, data, interceptor, headers);
                };
                for (var key in $delegate) {
                    proxy[key] = $delegate[key];
                }
                return proxy;
            });
        }])

        modelCarousel.run(['$httpBackend', function ($httpBackend) {

            // Add here regular expression for all URLs which should be passed trhough in the mocks
            var passThrough = [
                { method: "GET", regex: /ng-views\/.*/ },
                { method: "GET", regex: /ng-components\/.*/ },
                { method: "GET", regex: /ng-directives\/.*/ },
                { method: "GET", regex: /mockData\/.*/ }
            ];

            for (var i = 0; i < passThrough.length; i++) {
                var method = passThrough[i].method,
                    regex  = passThrough[i].regex;
                $httpBackend.when(method, regex).passThrough();
            }

        }]);

    }
});