define(['modelCarousel'], function(modelCarousel) {
    'use strict';



    modelCarousel.directive('modelCarousel', ['modelCarouselService', '$timeout',
        function(modelCarouselService, $timeout, $swipe) {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: '/audi-ui/apps/modelCarousel/ng-views/modelCarousel.html',
                controller: function($scope, $timeout) {
                    $scope.classificationNodes = modelCarouselService.classificationNodes; // holds the Classification Nodes
                    $scope.currentItems = [];

                    var init = function() {


                        modelCarouselService.loadModels().then(function(response) {

                            $scope.setCars($scope.classificationNodes[0])
                            $timeout(function() {
                                $scope.setCars($scope.classificationNodes[0])
                            }, 400)

                        }, function(response) {
                            // error

                        });

                    }

                    $scope.setCars = function(node) {

                        angular.forEach($scope.classificationNodes, function(item) {
                            item.active = false;
                        })
                        node.active = true;

                        if (typeof $('#carousel1').data('microfiche') === 'object') {


                            $('#carousel1').fadeTo(300, 0) // fade current lot out
                            $timeout(function() {

                                angular.copy(node.classifiedItems, $scope.currentItems)


                                // update current stuff
                                $timeout(function() {

                                    $('#carousel1').microfiche({
                                        refresh: true
                                    })
                                    $('#carousel1').fadeTo(0, 0);
                                    var carousel = $('#carousel1').data('microfiche');
                                    var pages = carousel.totalPageCount()

                                    if (pages > 1) {


                                        $timeout(function() {

                                            $('#carousel1').microfiche({
                                                jumpToPage: 2
                                            });

                                            $('#carousel1').microfiche({
                                                slideByPages: -1
                                            })
                                            animateDriveIn();
                                        }, 200);


                                    } else {
                                        animateDriveIn()
                                    }

                                }, 20); //wait for microfich to update
                            }, 400)



                        } else {

                            angular.copy(node.classifiedItems, $scope.currentItems)

                            $('#carousel1').microfiche({
                                noScrollAlign: 'center',
                                bullets: false,
                                refreshOnResize: true,
                                prevButtonLabel: '',
                                nextButtonLabel: ''
                            });

                        }


                    }



                    var animateDriveIn = function() {
                        // TODO
                        $('#carousel1').fadeTo(0, 0).fadeTo(800, 1)

                        var totalItems = $('#carousel1 li').length;
                        $('#carousel1 li').each(function(inde) {
                            $(this).css({
                                left: '-700px',
                                opacity: 0,
                                position: 'relative'
                            })
                            $(this).delay(80 * totalItems).animate({
                                left: 0,
                                opacity: 1
                            }, 800, function(x, t, b, c, d) {
                                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                            });


                            var label = $(this).find('.modelLabel')
                            label.css({
                                top: '-50px',
                                position: 'relative',
                                opacity: 0
                            })
                            label.delay((20 * totalItems) + 600).animate({
                                top: 0,
                                opacity: 1
                            }, 300, function(x, t, b, c, d) {
                                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                            });




                            totalItems--;
                        })

                    }

                    init();
                }
            };
        }
    ]);


    modelCarousel.directive('fallbackSrc', function() {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function() {
                    angular.element(this).attr("src", iAttrs.fallbackSrc);
                });
            }
        }
        return fallbackSrc;
    });

    modelCarousel.directive('imgPreload', function() {
        return {
            restrict: 'A',
            scope: {
                ngSrc: '@'
            },
            link: function(scope, element, attrs) {
                element.on('load', function() {
                    console.log('loading.....', element)
                    element.addClass('in');
                }).on('error', function() {
                    //
                });

                scope.$watch('ngSrc', function(newVal) {
                    element.removeClass('in');
                });
            }
        };
    });

});