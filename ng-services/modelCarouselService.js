define(['modelCarousel'], function (modelCarousel) {
	'use strict';

	if(window.console) console.log("modelCarouselService loaded");

	modelCarousel.factory('modelCarouselService', ['$resource', '$http', '$q', '$httpBackend', 'apiService', 
		function ($resource, $http, $q, $httpBackend, apiService, $state) {

			var classificationNodes = []; 
	

			var loadModels = function() {
				var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url:'/audi-ui/apps/modelCarousel/mockData/models.js'
                    // url:'http://audi-dailybuild-web.salmon.com:30067/pdb-override/rest/schemes/TypeOfCar/nodes/models&colapseRange=true'
                })
                    .success(function(data, status) {
                   
						angular.copy(data.data.classificationNodes, classificationNodes); 


						deferred.resolve();
                    })
                    .error (function(data, status) {
						deferred.reject(data);
                    });

                return deferred.promise;
            }

			return {
				classificationNodes: classificationNodes, 
				loadModels: loadModels
			};
		}
	]);
});