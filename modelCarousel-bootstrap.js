define([
	'ng',
	'sa-utils',
	'ng-touch',
	
	'modelCarousel',
	'modelCarousel-config',
		
	'modelCarousel-apiService',
	'modelCarousel-apiServiceMocks',



	'modelCarousel-Service',
	'modelCarousel-Ctrl',
	'microfiche_carousel'



], function (angular, app) {

	'use strict';

	var el = document.getElementById('modelCarousel');

	angular.element(el).ready(function() {
		angular.bootstrap(el, ['modelCarousel']);
	});

});
