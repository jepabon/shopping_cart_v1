var shopApp = angular.module('shopApp', ['ngCookies'])

shopApp.run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
});

shopApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});


shopApp.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});

shopApp.controller('base_controller', function($scope, $http) {
    $scope.products = [];
    $scope.next = null;
    $scope.previous = null;
    
    $scope.load_products = function(url) {
        if (typeof url === 'undefined') {
            url = '/api/v1/products/'
        }
        $http({
            url: url,
            method: "GET",
            data: {},
            headers: {'Content-Type': 'application/json'},
        }).then(function (response) {
            $scope.products = response.data.results;
            $scope.next = response.data.next;
            $scope.previous = response.data.previous;
        });
    }


    $scope.addProduct = function(product) {
        let data = {
            'id_product': product.id,
            'amount': product.amount
        }
        $http({
            url: 'api/v1/orders/add_product/',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'},
        }).then(function (response) {
            alert(response.data.status)
        });
    };
})