

describe('macros', () => {
    beforeEach(window.module('superdesk.apps.desks'));
    beforeEach(window.module('superdesk.apps.authoring.macros'));
    beforeEach(window.module('superdesk.apps.authoring.autosave'));

    var $controller;

    beforeEach(inject((_$controller_, macros, $q) => {
        $controller = _$controller_;
        spyOn(macros, 'get').and.returnValue($q.when([]));
    }));

    it('can trigger macro with diff', inject((macros, api, $q, $rootScope) => {
        var diff = {foo: 'bar'};
        var item = {_id: '1'};

        spyOn(api, 'save').and.returnValue($q.when({item: item, diff: diff}));
        macros.call('test', item);
        expect(api.save).toHaveBeenCalled();
        $rootScope.$digest();
    }));

    it('trigger macro with diff does not update item', inject((macros, $q, autosave, $rootScope) => {
        var diff = {foo: 'bar'};
        var item = {_id: '1'};
        var $scope = $rootScope.$new();

        spyOn(macros, 'call').and.returnValue($q.when({item: item, diff: diff}));
        spyOn($rootScope, '$broadcast');
        $scope.origItem = {};
        $scope.item = item;
        $scope.closeWidget = function() { /* no-op */ };
        $controller('Macros', {$scope: $scope});
        $scope.call('test');
        expect(macros.call).toHaveBeenCalled();
        $scope.$digest();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('macro:diff', diff);
    }));
});
