var main = angular.module('main', ['ngRoute', 'firebase'])

main.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'template/calculator.html',
			controller: 'calcCtrl'
		})
		.when('/calculator', {
			templateUrl: 'template/calculator.html',
			controller: 'calcCtrl'
		})
		.when('/login', {
			templateUrl: 'template/login.html',
			controller: 'loginCtrl'
		})
		.when('/register', {
			templateUrl: 'template/register.html',
			controller: 'registerCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});