define(['modelCarousel'], function(modelCarousel) {

	'use strict';

	modelCarousel.factory('apiServiceMocks', ['$httpBackend',
		function($httpBackend) {

			var getQueryVar = function(query, varName) {
				var vars = query.split("&");
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					if (pair[0] == varName) {
						return pair[1];
					}
				}
				return (false);
			}

			var apiUrl = modelCarousel.appConfig.urls.api;

			var RI_SUCCESS = {
				code: 0,
				desc: "Success"
			};

			var setupMocks = function() {

				$httpBackend.whenGET(apiUrl + "profile")
					.respond(function (method, url, data) {

						var data = {
							"myAudiId": "124",
							"dbgId": "12346",
							"cbpId": "34678",
							"primaryPreferredDealerCode": "00224",
							"SecondaryPreferredDealerCode": "03576",
							"title": "Mr",
							"initials": "J",
							"forename": "Alex",
							"surname": "Stewart",
							"formalSalutation": "Dear",
							"informalSalutation": "Hi",
							"organisationName": "Salmon Ltd",
							"address1": "",
							"address2": "",
							"city": "",
							"postcode": "",
							"county": "",
							"country": "",
							"pafValidated": "true",
							"genderCode": "M",
							"dateOfBirth": "120974",
							"maritalStatus": "M",
							"email": "mbrook@Salmon.com",
							"workPhoneNumber": "01932320144",
							"homePhoneNumber": "01727875493",
							"mobilePhoneNumber": "07710500030",
							"addressValidFrom": "020714",
							"prefCommType": "Phone",
							"commPrefTime": "10am",
							"chelseaSupporter": "0",
							"nearestDealerKey": "00234"
						};

						return [200, {
							responseInfo: RI_SUCCESS,
							data: data
						}, {}];
					});

				// get unread messages count
				$httpBackend.whenGET(apiUrl + "messages?filter=UNREAD")
					.respond(function (method, url, data) {
						data = angular.fromJson(data);

						var data = {
									"pageSize": 5,
									"pageNumber": 1,
									"totalCount": 48,
									"totalPages": 5
								  };

						return [200, {
							responseInfo: RI_SUCCESS,
							listInfo: data
						}, {}];
					});

			}

			return {
				setupMocks: setupMocks
			}
		}
	]);
});
