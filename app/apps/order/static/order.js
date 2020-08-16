shopApp.controller('order_controller', function($scope, $http) {
    $scope.products = [];
    $scope.order = null;
    
    $scope.load_active_order = function() {
        $http({
            url: '/api/v1/orders/get_active_order',
            method: "GET",
            data: {},
            headers: {'Content-Type': 'application/json'},
        }).then(function (response) {
            $scope.products = response.data.items;
            $scope.order = response.data.order;
        });
    }


    $scope.confirmed_order = function() {
        $http({
            url: '/api/v1/orders/confirmed_order',
            method: "GET",
            data: {},
            headers: {'Content-Type': 'application/json'},
        }).then(function (response) {
            $scope.products = response.data.items;
            $scope.order = response.data.order;
            if (response.data.status) {
                alert(response.data.status);
            }
        });
    }


    $scope.removeProduct = function(product) {
        let data = {
            'id': product.id,
        }
        $http({
            url: '/api/v1/orders/remove_product/',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'},
        }).then(function (response) {
            $scope.products = response.data.items;
            $scope.order = response.data.order;
        });
    }


    $scope.clean_order = function() {
        $http({
            url: '/api/v1/orders/clean_products/',
            method: "GET",
            data: {},
            headers: {'Content-Type': 'application/json'},
        }).then(function (response) {
            $scope.products = response.data.items;
            $scope.order = response.data.order;
        });
    }
});