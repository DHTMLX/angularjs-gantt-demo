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


function templateHelper($element){
  var template = $element[0].innerHTML;
  return template.replace(/[\r\n]/g,"").replace(/"/g, "\\\"").replace(/\{\{task\.([^\}]+)\}\}/g, function(match, prop){
    if (prop.indexOf("|") != -1){
      var parts = prop.split("|");
      return "\"+gantt.aFilter('"+(parts[1]).trim()+"')(task."+(parts[0]).trim()+")+\"";
    }
    return '"+task.'+prop+'+"';
  });
}
app.directive('ganttTemplate', ['$filter', function($filter){
  gantt.aFilter = $filter;

  return {
    restrict: 'AE',
    terminal:true,
   
    link:function($scope, $element, $attrs, $controller){
      var template =  Function('sd','ed','task', 'return "'+templateHelper($element)+'"');
      gantt.templates[$attrs.ganttTemplate] = template;
    }
  };
}]);

app.directive('ganttColumn', ['$filter', function($filter){
  gantt.aFilter = $filter;

  return {
    restrict: 'AE',
    terminal:true,
   
    link:function($scope, $element, $attrs, $controller){
      var label  = $attrs.label || " ";
      var width  = $attrs.width || "*";
      var align  = $attrs.align || "left";

      var template =  Function('task', 'return "'+templateHelper($element)+'"');
      var config = { template:template, label:label, width:width, align:align };
      
      if (!gantt.config.columnsSet)
          gantt.config.columnsSet = gantt.config.columns = [];

      if (!gantt.config.columns.length)
        config.tree = true;
      gantt.config.columns.push(config);

    }
  };
}]);

app.directive('ganttColumnAdd', ['$filter', function($filter){
  return {
    restrict: 'AE',
    terminal:true,
    link:function(){
      gantt.config.columns.push({ width:45, name:"add" });
    }
  }
}]);

})();