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
        }).
        state('menu.search',{
            url:'/search',
            controller: 'search',
            templateUrl: 'templates/search.html'
        })
        .state('menu.curvaNormal',{
            url:'/curva-normal',
            controller:'curva_Gauss',
            templateUrl: 'templates/campana_gauss.html'
        })
        .state('menu',{
            url:'/menu',
            templateUrl: 'templates/menu.html'
        });

    $urlRouterProvider.otherwise('/menu/home');

}]);
