app
.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('home', {
            url:'/home',
            templateUrl: 'templates/home.html'
        })
        .state('uploadExcel',{
            url:'/upload-excel',
            templateUrl: 'templates/upload_excel.html'
        });
}]);