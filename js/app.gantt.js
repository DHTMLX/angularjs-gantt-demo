(function(){

app.directive('dhxGantt', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template: '<div ng-transclude></div>',

    link:function ($scope, $element, $attrs, $controller){
      //watch data collection, reload on changes
      $scope.$watch($attrs.data, function(collection){
        gantt.clearAll();
        gantt.parse(collection, "json");
      }, true);

      //size of gantt
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        gantt.setSizes();
      });

      //init gantt
      gantt.init($element[0]);
    }
  };
});

app.directive('ganttTemplate', ['$interpolate', function($interpolate){
  return {
    restrict: 'AE',
    terminal:true,
   
    link:function($scope, $element, $attrs, $controller){

      var interpolated = $interpolate($element.html());

      gantt.templates[$attrs.ganttTemplate] = function(start, end, task){
        return interpolated({task: task});
      };
    }
  };
}]);

app.directive('ganttColumn', ['$interpolate', function($interpolate){
  return {
    restrict: 'AE',
    terminal:true,
   
    link:function($scope, $element, $attrs, $controller){
      var label  = $attrs.label || " ";
      var width  = $attrs.width || "*";
      var align  = $attrs.align || "left";

      var interpolated = $interpolate($element.html());
      var template = function(task) {
        return interpolated({ task: task });
      };

      var config = { template:template, label:label, width:width, align:align };
      
      if (!gantt.config.columnsSet)
          gantt.config.columnsSet = gantt.config.columns = [];

      if (!gantt.config.columns.length)
        config.tree = true;
      gantt.config.columns.push(config);

    }
  };
}]);

app.directive('ganttColumnAdd', [function(){
  return {
    restrict: 'AE',
    terminal:true,
    link:function(){
      gantt.config.columns.push({ width:45, name:"add" });
    }
  }
}]);

})();