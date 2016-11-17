app
.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('menu.home', {
            url:'/home',
            templateUrl: 'templates/home.html'
        })
        .state('menu.uploadExcel',{
            url:'/upload-excel',
            controller: 'uploadExcel',
            templateUrl: 'templates/upload_excel.html'
        })
        .state('menu',{
            url:'/menu',
            templateUrl: 'templates/menu.html'
        });

    $urlRouterProvider.otherwise('/menu/home');

}]);