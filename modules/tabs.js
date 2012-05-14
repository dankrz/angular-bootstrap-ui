angular.module('angularBootstrap.tabs', []).
directive('bootstrapTabs', function() {
    var defaults = {
        itemSelectedAttr: 'selected',
        itemTitleAttr: 'title'
    };

    var controllerFn = function($scope, $element, $attrs) {
        var opts = angular.extend(defaults, attrs);

        //Have to watch items().length. If we just watch items(), 
        //the watch will never actually trigger itself        
        $scope.$watch('items().length', function(newLength, oldLength) {
            var selectedItem;
            
            //Instant select first item created in list
            if (newLength == 1 && oldLength == 0) {
                $scope.selectItem($scope.items()[0]);
            }
                      
            //If an item was deleted and still atleast one item in the array
            if (newLength < oldLength && newLength > 0) {
                //get selected item (it might be gone from array)
                selectedItem = $scope.selectedIdx < newLength ?
                    $scope.items()[$scope.selectedIdx] : null;
                
                //if selected item is null, it was at the end
                if (selectedItem === null) {
                    $scope.selectItem($scope.items()[$scope.selectedIdx-1]);                           
                //if item at selectedIdx is not selected, we know it was deleted
                } else if (!$scope.itemSelected([selectedItem])) {
                    $scope.selectItem($scope.items()[$scope.selectedIdx]);
                }                                           
            }
        });
        
        $scope.selectItem = function(item) {
            angular.forEach($scope.items(), function(item, index) {
                 item[opts.itemSelectedAttr] = false;
            });
            item[opts.itemSelectedAttr] = true;
            $scope.selectedIdx = $scope.items().indexOf(item);

            //Call optional itemSelect callback if it was set
            if ($scope.itemSelect)
                $scope.itemSelect(item);
        };

        $scope.itemSelected = function(item) {
            return item[opts.itemSelectedAttr];
        };

        $scope.itemTitle = function(item) {
            return item[opts.itemTitleAttr];
        };
        
        //We set this the tab-item can access the main Ctrl through parent.Fn()
        $scope.parent = $scope.$parent;
    }

    return {
        controller: controllerFn,
        scope: {
            items: 'accessor',
            itemSelect: 'evaluate',
            itemTemplate: 'attribute',
            itemTitleAttr: 'attribute'
        },
        restrict: 'E',
        template:
        '<div class="tabbable">' +
            '<ul class="nav nav-tabs">' +
                '<li ng-repeat="item in items()" ng-class="{active:itemSelected(item)}">'+
                    '<a href="#" ng-click="selectItem(item)">{{itemTitle(item)}}</a>' +
                '</li>' +
            '</ul>' +
        '<div class="tab-content">'+
            '<div ng-repeat="item in items()">'+
                '<div class="tab-pane" ng-class="{active: itemSelected(item), hidden: !itemSelected(item)}">'+
                    '<ng-include src="itemTemplate"></ng-include>'+
                '</div>'+
            '</div>'+
        '</div>'
    }
});
