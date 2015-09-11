angular.module('app', [])
    .factory('queryService', function ($http) {
        return {
            async: function (query) {
                var url = 'http://suggestqueries.google.com/complete/search?client=firefox&q=' + query;
                return $http.get(url).success(function (data) {
                    return data[1];
                });
            },
            returnData: function (data) {
                return data.data[1];
            }
        };
    })
    .directive('autocomplete', ['$http', '$compile', 'queryService', function ($http, $compile, queryService) {
        return {
            restrict: 'E',
            link: function (scope, element, attr) {
                var p = $("#query-input");
                $('#auto-wrapper').css('left', p.position().left + 'px');
                $('#auto-wrapper').css('width', p.width() + 'px');

                scope.$watch('query', function (query) {
                    if (query) {
                        queryService.async(query).then(function (data) {
                            scope.suggestions = queryService.returnData(data);
                        });
                    } else {
                        scope.suggestions = null;
                    }
                });

                scope.clickItem = function (clickEvent) {
                    scope.query = clickEvent.target.innerText;
                };
            },
            scope: {},
            templateUrl: 'template.html'
        };
    }]);
