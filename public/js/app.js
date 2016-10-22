angular.module("flightapp", ['ngRoute','smart-table'])
    .config(function($routeProvider,$locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "Flights.html",
                controller: "fltController",
                resolve: {
                    flights: function(flights) {
                      return flights.getFlights();
                    }
                }
            })
           .when("/flights/:flightNumber", {
                templateUrl: "Flightdetails.html",
                controller: "FlightDetailController"
            })
            .otherwise({
                redirectTo: "/"
            })
            $locationProvider.html5Mode(true);
    })
    .service("flights", function($http) {
        this.getFlights = function() {
            return $http.get("/flights").
                then(function(response) {
                    console.log("inside getflights");
                    return response;
                }, function(response) {
                    alert("Error finding flights.");
                });
        }
        this.getFlight = function(flightNumber) {
            var url = "/flights/" + flightNumber;
            console.log("inside getflight for number");
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
    })
    .controller("fltController", function(flights, $scope) {
        $scope.flights = flights.data;
    })
    .controller("FlightDetailController", function($scope, $routeParams, flights) {
        console.log("testing");
        flights.getFlight($routeParams.flightNumber).then(function(doc) {
            $scope.flight = doc.data;
        }, function(response) {
            alert(response);
        });
    });