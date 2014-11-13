
define( ['ng'], function (angular) {
	
	'use strict';

	try {
		angular.module('modelCarousel');
	} catch(err) {
		angular.module('modelCarousel', [
				'ngResource',
			'ngSanitize',
			'ui.bootstrap',
			'sa.utils',
				'ngTouch'
		])
	}

	return angular.module('modelCarousel');
});
