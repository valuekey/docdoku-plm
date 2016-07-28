(function(){

    'use strict';

    angular.module('dplm.home', [])

        .config(function ($routeProvider) {
            $routeProvider.when('/', {
                controller: 'HomeCtrl',
                templateUrl: 'js/home/home.html'
            });
        })

        .controller('HomeCtrl',function ($scope, FolderService, WorkspaceService, RepositoryService) {

            var syncWorkspaces = function(){
                return WorkspaceService.fetchAllWorkspaces(WorkspaceService.workspaces)
            };

            var syncIndexes = function(){
                return RepositoryService.syncIndexes(FolderService.folders.map(function(folder){
                    return folder.path;
                }))
            };

            var onError = function(error){
                $scope.status = error;
            };

            var onProgress = function(status){
                $scope.status = status;
            };

            var onSyncEnd = function(){
                $scope.$broadcast('refresh');
                $scope.status = null;
            };

            $scope.syncWorkspace = function(workspaceId){
                WorkspaceService.refreshData(workspaceId)
                    .then(null,null,onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncIndex = function(path){
                RepositoryService.syncIndex(path)
                    .then(null,null,onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncWorkspaces = function(){
                syncWorkspaces()
                    .then(null,null,onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncIndexes = function(){
                syncIndexes()
                    .then(null,null,onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncAll = function(){
                syncWorkspaces()
                    .then(syncIndexes)
                    .then(null,null,onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

        })

        .controller('HistoryCtrl',function($scope){
            $scope.history = 'todo';
        })

        .controller('LatestEventsCtrl',function($scope, WorkspaceService){
            $scope.workspaces = WorkspaceService.workspaces;
        })

        .directive('folderLocalChanges',function(){
            return {
                restrict: 'A',
                templateUrl:'js/home/folder-local-changes.html',
                scope:{
                    folder:'=folderLocalChanges'
                },
                controller:function($scope, FolderService,RepositoryService){

                    var path = $scope.folder.path;

                    var refresh = function(){
                        $scope.changes = RepositoryService.getLocalChanges(path);
                    };

                    $scope.$on('refresh',refresh);

                    refresh();
                }
            }
        })

        .directive('folder',function(){

            return {
                restrict: 'A',
                templateUrl:'js/home/folder-item.html',
                scope:{
                    folder:'='
                },
                controller:function($scope, FolderService){

                    var refresh = function(){
                        FolderService.getFilesCount($scope.folder.path).then(function(count){
                            $scope.filesCount = count;
                            console.log(count)
                        });
                    };

                    $scope.$on('refresh',refresh);

                    refresh();
                }
            };


        })

        .directive('workspaceLatestEvents',function(){
            return {
                restrict: 'A',
                templateUrl:'js/home/workspace-latest-events.html',
                scope:{
                    workspace:'=workspaceLatestEvents'
                },
               controller:function($scope, $filter, WorkspaceService, ConfigurationService){

                   $scope.configuration = ConfigurationService.configuration;

                   var refresh = function(){
                       $scope.loading = true;
                       var lastIteration = $filter('lastIteration');
                       WorkspaceService.getLatestEventsInWorkspace($scope.workspace, 10)
                           .then(function(events){
                               $scope.events = events.map(function(item){
                                   item.lastIteration = lastIteration(item);
                                   return item;
                               });
                           }).finally(function(){
                               $scope.loading = false;
                           });
                   };

                   $scope.$on('refresh',refresh);

                   refresh();
               }
            }
        });

})();
