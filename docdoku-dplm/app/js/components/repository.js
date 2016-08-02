(function () {

    'use strict';

    angular.module('dplm.services.repository', [])

        .service('RepositoryService', function ($q, $timeout, $window, $filter,
                                                INDEX_LOCATION, INDEX_SEARCH_PATTERN, DocdokuAPIService, FolderService) {

            var _this = this;
            var fs = $window.require('fs');
            var crypto = $window.require('crypto');
            var glob = $window.require("glob");

            this.getRepositoryIndex = function (indexFolder) {
                try {
                    return $window.require(indexFolder + INDEX_LOCATION);
                } catch (e) {
                    var dir = indexFolder + '/.dplm/';
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFileSync(indexFolder + INDEX_LOCATION, '{}');
                    return $window.require(indexFolder + INDEX_LOCATION);
                }
            };

            this.search = function (folder) {
                return $q(function (resolve, reject) {
                    glob(INDEX_SEARCH_PATTERN, {
                        cwd: folder,
                        nodir: true
                    }, function (err, files) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(files);
                        }
                    });
                });
            };

            var getIndexValue = function (index, path, key) {
                return index[path + '.' + key] || null;
            };

            var setIndexValue = function (index, path, key, value) {
                index[path + '.' + key] = value;
            };

            var getHashFromFile = function (path) {
                return crypto.createHash('MD5').update(fs.readFileSync(path)).digest('base64');
            };

            this.getFileIndex = function (index, path) {

                var digest = getIndexValue(index, path, 'digest');

                return digest ? {
                    digest: digest,
                    workspace: getIndexValue(index, path, 'workspace'),
                    id: getIndexValue(index, path, 'id'),
                    number: getIndexValue(index, path, 'number'),
                    revision: getIndexValue(index, path, 'revision'),
                    iteration: getIndexValue(index, path, 'iteration'),
                    lastModifiedDate: getIndexValue(index, path, 'lastModifiedDate'),
                    hash: getHashFromFile(path)
                } : null;
            };

            var writeIndex = function (indexPath, index) {
                fs.writeFileSync(indexPath, JSON.stringify(index));
            };

            this.writeIndex = writeIndex;

            this.getIndexPath = function (folder) {
                return folder + INDEX_LOCATION;
            };

            var updateIndexForPart = function (index, path, part) {
                setIndexValue(index, path, 'hash', getHashFromFile(path));
                setIndexValue(index, path, 'workspace', part.workspaceId);
                setIndexValue(index, path, 'number', part.number);
                setIndexValue(index, path, 'revision', part.version);
                setIndexValue(index, path, 'iteration', part.partIterations.length);
            };

            var updateIndexForDocument = function (index, path, document) {
                setIndexValue(index, path, 'hash', getHashFromFile(path));
                setIndexValue(index, path, 'workspace', document.workspaceId);
                setIndexValue(index, path, 'id', document.documentMasterId);
                setIndexValue(index, path, 'revision', document.version);
                setIndexValue(index, path, 'iteration', document.documentIterations.length);
            };

            var updateFile = function (index, path) {
                setIndexValue(index, path, 'digest', getHashFromFile(path));
                setIndexValue(index, path, 'lastModifiedDate', Date.now());
            };

            var removeFromIndex = function (index, path) {
                delete index[path + '.digest'];
                delete index[path + '.workspace'];
                delete index[path + '.number'];
                delete index[path + '.id'];
                delete index[path + '.revision'];
                delete index[path + '.iteration'];
                delete index[path + '.lastModifiedDate'];
            };

            this.updateItemInIndex = function (index, item, path) {
                if (item.number) {
                    updateIndexForPart(index, path, item);
                } else if (item.id) {
                    updateIndexForDocument(index, path, item);
                }
                updateFile(index, path);
            };

            this.saveItemToIndex = function (indexFolder, path, item) {
                if (item.number) {
                    _this.savePartToIndex(indexFolder, path, item);
                } else if (item.id) {
                    _this.saveDocumentToIndex(indexFolder, path, item);
                }
            };

            this.savePartToIndex = function (indexFolder, path, part) {
                var indexPath = indexFolder + INDEX_LOCATION;
                var index = _this.getRepositoryIndex(indexFolder);
                updateIndexForPart(index, path, part);
                updateFile(index, path);
                writeIndex(indexPath, index);
                return index;
            };

            this.saveDocumentToIndex = function (indexFolder, path, document) {
                var indexPath = indexFolder + INDEX_LOCATION;
                var index = _this.getRepositoryIndex(indexFolder);
                updateIndexForDocument(index, path, document);
                updateFile(index, path);
                writeIndex(indexPath, index);
                return index;
            };


            var documentRequest = function (api, workspaceId, documentId, version) {
                return function () {
                    return $q(function (resolve, reject) {
                        api.apis.document.getDocumentRevision({
                            workspaceId: workspaceId,
                            documentId: documentId,
                            documentVersion: version
                        }).then(function (response) {
                            resolve(response.obj);
                        }, reject);
                    });
                };
            };

            var partRequest = function (api, workspaceId, number, version) {
                return function () {
                    return $q(function (resolve, reject) {
                        api.apis.part.getPartRevision({
                            workspaceId: workspaceId,
                            partNumber: number,
                            partVersion: version
                        }).then(function (response) {
                            resolve(response.obj);
                        }, reject);
                    });
                };
            };

            this.getLocalChanges = function (folder) {
                var indexFolder = folder.path;
                var index = _this.getRepositoryIndex(indexFolder);
                var keys = Object.keys(index);
                var files = [];

                angular.forEach(keys, function (key) {
                    var path;
                    if (key.endsWith('.id')) {
                        path = key.substr(0, key.length - 3);
                    } else if (key.endsWith('.number')) {
                        path = key.substr(0, key.length - 7);
                    }
                    if (_this.isModified(index, path)) {
                        files.push(path);
                    }
                });
                folder.localChanges = files;
                return files;
            };

            this.isModified = function (index, path) {
                return path && getIndexValue(index, path, 'hash') !== getIndexValue(index, path, 'digest');
            };

            var fileShortName = $filter('fileShortName');
            var lastIteration = $filter('lastIteration');
            var utcToLocalDateTime = $filter('utcToLocalDateTime');

            var getItemBinaryResource = function (item, path) {
                var name = fileShortName(path);
                var itemLastIteration = lastIteration(item);
                var binaryResource;
                if (item.id) {
                    binaryResource = $filter('filter')(itemLastIteration.attachedFiles, {name: name})[0];
                } else if (item.number) {
                    binaryResource = itemLastIteration.nativeCADFile;
                }
                return binaryResource;
            };

            this.isOutOfDate = function (index, file) {
                if (!file.index || !file.item) {
                    console.log(file)
                    return false;
                }
                var binary = getItemBinaryResource(file.item, file.path);
                return binary && getIndexValue(index, file.path, 'lastModifiedDate') < new Date(binary.lastModified).getTime();
            };

            this.syncIndex = function (indexFolder) {

                var deferred = $q.defer();

                var promise = deferred.promise;

                var indexPath = indexFolder + INDEX_LOCATION;
                var index = _this.getRepositoryIndex(indexFolder);
                var keys = Object.keys(index);

                var documents = keys.filter(function (key) {
                    return key.endsWith('.id');
                });

                var parts = keys.filter(function (key) {
                    return key.endsWith('.number');
                });

                var progress = 0;
                var total = documents.length + parts.length;

                var notify = function () {
                    deferred.notify({total: total, progress: ++progress, folder: indexFolder});
                };

                deferred.notify({total: total, progress: 0, folder: indexFolder});

                var chain = $q.when();

                DocdokuAPIService.getClient().getApi().then(function (api) {

                    documents.forEach(function (id) {
                        var filePath = id.substr(0, id.length - 3);
                        var version = getIndexValue(index, filePath, 'revision');
                        var workspaceId = getIndexValue(index, filePath, 'workspace');
                        chain = chain.then(documentRequest(api, workspaceId, index[id], version)).then(function (document) {
                            updateIndexForDocument(index, filePath, document);
                            return document;
                        }, function () {
                            removeFromIndex(index, filePath);
                        }).then(notify);
                    });

                    parts.forEach(function (number) {
                        var filePath = number.substr(0, number.length - 7);
                        var version = getIndexValue(index, filePath, 'revision');
                        var workspaceId = getIndexValue(index, filePath, 'workspace');
                        chain = chain.then(partRequest(api, workspaceId, index[number], version)).then(function (part) {
                            updateIndexForPart(index, filePath, part);
                            return part;
                        }, function () {
                            removeFromIndex(index, filePath);
                        }).then(notify);
                    });

                    return chain;

                }).then(function () {
                    FolderService.getFolder({path: indexFolder}).lastSync = new Date();
                    FolderService.save();
                    writeIndex(indexPath, index);
                    deferred.resolve();
                });

                return promise;

            };

            this.syncIndexes = function (indexFolders) {

                var deferred = $q.defer();
                var promise = deferred.promise;
                var chain = $q.when();

                angular.forEach(indexFolders, function (folderPath) {
                    chain = chain.then(function () {
                        return _this.syncIndex(folderPath);
                    });
                });

                chain.then(deferred.resolve, null, deferred.notify);

                return promise;
            };

        });

})();
