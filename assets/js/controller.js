localStorage.setItem('username', 'tantaroth');

function calcCtrl($scope, $firebase) {
	var refFinanzas = new Firebase('https://myfinances.firebaseio.com/');
	var refData = refFinanzas.child('users/tantaroth/finanzas');
	var syncData = $firebase(refData);
	var _Date = new Date();
	var _Day = _Date.getDate();
	var _DayWeek = _Date.getDay();
	var _month = _Date.getMonth();
	var _year = _Date.getFullYear();

	$scope.count = 0;
	$scope.valSuccess = 0;
	$scope.valDanger = 0;

	$scope.createUser = function () {
		var refUser = refFinanzas.child('users');
		var syncUser = $firebase(refUser);
		var objUser = new Object();
			objUser[localStorage.username] = '';

		syncUser.$set(objUser).then(
			function(){
				console.log("Logged.");
			}, 
			function(err){
				console.log("Erro. "+err);
			});
	}

	$scope.sumTotal = function (param, obj) {
		var param = (param) ? param : false;
		var obj = (obj) ? obj : false;

		return {
			success: function () {
			    var subtotal = 0;

				for (var value in obj) {
					if (obj[value].status == 0) {
						subtotal += parseInt(obj[value][param]);
					};
				};
				$scope.valSuccess = subtotal;

				return subtotal;
			},
			danger: function () {
			    var subtotal = 0;

				for (var value in obj) {
					if (obj[value].status == 1) {
						subtotal += parseInt(obj[value][param]);
					};
				};
				$scope.valDanger = subtotal;

				return subtotal;
			},
			total: function () {
				return parseInt($scope.valSuccess) - parseInt($scope.valDanger);
			}
		};
	};

	$scope.getStringTool = function (param) {
		var param = (param) ? param : false;
		
		return {
			status: function(){
				switch(param){
					case false:
						return "success";
					break;
					case 0:
						return "success";
					break;
					case '0':
						return "success";
					break;
					case 1:
						return "danger";
					break;
					case '1':
						return "danger";
					break;
					default:
						return "default";
					break;
				};
			},
			day: function(){
				switch(param){
					case '1':
						return "Lunes";
					break;
					case '2':
						return "Martes";
					break;
					case '3':
						return "Miercoles";
					break;
					case '4':
						return "Jueves";
					break;
					case '5':
						return "Viernes";
					break;
					case '6':
						return "Sabado";
					break;
					case '0':
						return "Domingo";
					break;
					default:
						return "No definido";
					break;
				};
			},
			month: function () {
				switch(param){
					case 0:
						return 'enero';
					break;
					case 1:
						return 'febrero';
					break;
					case 2:
						return 'marzo';
					break;
					case 3:
						return 'abril';
					break;
					case 4:
						return 'mayo';
					break;
					case 5:
						return 'junio';
					break;
					case 6:
						return 'julio';
					break;
					case 7:
						return 'agosto';
					break;
					case 8:
						return 'septiembre';
					break;
					case 9:
						return 'octubre';
					break;
					case 10:
						return 'noviembre';
					break;
					case 11:
						return 'diciembre';
					break;
					default:
						return 'No definido'
					break;
				}
				return param;
			}
		};
	}
	var monthString = $scope.getStringTool(_month).month();

	$scope.finanzas = syncData.$asObject();

	$scope.addItem = function (value, status) {
		var _Date = new Date();
		var _month = _Date.getMonth();
		var _year = _Date.getFullYear();
		var pk, _data;

		if (jQuery('#'+_month+'_'+_year).val()) {
			pk = (jQuery('#'+_month+'_'+_year).val())+'/days/';
			console.log('users/'+localStorage.username+'/finanzas/'+pk);

			var refFinanza = refFinanzas.child('users/'+localStorage.username+'/finanzas/'+pk);
			var syncFinanza = $firebase(refFinanza);

			_data = {
					'day': _DayWeek+'_'+_Day,
					'index': '0',
					'priority': '0',
					'status': status,
					'title': 'Título',
					'description': 'Descripción',
					'value': value,
					'coin': 'COP',
					'tags': ['Mensual']
				};

			syncFinanza.$push(_data).then(
				function(){
					console.log("Guardado.");
				}, 
				function(err){
					console.log("Erro. "+err);
				});
		}else{
			pk = '';

			var refFinanza = refFinanzas.child('users/'+localStorage.username+'/finanzas/'+monthString+'/');
			var syncFinanza = $firebase(refFinanza);

			_data = {
				'general_data': {
					'year': _year,
					'month': _month
				},
				'days': [
					{
						'day': _DayWeek+'_'+_Day,
						'index': '0',
						'priority': '0',
						'status': status,
						'title': 'Título',
						'description': 'Descripción',
						'value': value,
						'coin': 'COP',
						'tags': ['Mensual']
					}
				]
			};

			syncFinanza.$set(_data).then(
				function(){
					console.log("Guardado.");
				}, 
				function(err){
					console.log("Erro. "+err);
				});
		};
	};

	$scope.editItem = function (pk, field) {
		var pk = (pk) ? pk : false;
		var	pkFinanza = (document.getElementById(_month+'_'+_year).value)+'/days/';

		if (pk) {
			var value;
			var refFinanza = refFinanzas.child('users/'+localStorage.username+'/finanzas/'+pkFinanza+pk);
			var syncFinanza = $firebase(refFinanza);
			var dataEdit = new Object();

				value = $('#'+field+'_'+pk).text();
				dataEdit[field] = value;

			syncFinanza.$update(dataEdit);
		};
	}

	$scope.removeItem = function (pk) {
		var pk = (pk) ? pk : false;
		var	pkFinanza = (document.getElementById(_month+'_'+_year).value)+'/days/';

		if (pk) {
			var refFinanza = refFinanzas.child('users/'+localStorage.username+'/finanzas/'+pkFinanza);
			var syncFinanza = $firebase(refFinanza);

			syncFinanza.$remove(pk).then(
				function(){
					console.log("Removido.");
				}, 
				function(err){
					console.log("Erro. "+err);
				});
		};
	}
}