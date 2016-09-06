(function () {
    'use strict';

    angular.module('dplm.services')
        .config(function ($translateProvider) {

            $translateProvider
                .translations('en', {
                    CHECKOUT: 'Checkout',
                    CHECKIN: 'Checkin',
                    UNDO_CHECKOUT: 'Undo checkout',
                    PUT: 'Put',
                    FORCE_REWRITE: 'Force rewrite',
                    CREATE_PART: 'Create a new part',
                    CREATE_DOCUMENT: 'Create a new document',
                    STANDARD: 'Standard part',
                    WORKSPACE: 'Workspace',
                    REFRESH_WORKSPACES: 'Refresh workspaces list',
                    SAVE: 'Save',
                    OPEN_IN_EXPLORER: 'Open in explorer',
                    OPEN_IN_BROWSER: 'Open in browser',
                    FAVORITE: 'Favorite',
                    REFRESH_FOLDER: 'Refresh folder',
                    DOWNLOAD: 'Download',
                    HOME: 'Home',
                    SETTINGS: 'Settings',
                    LANG: 'Lang',
                    FR: 'French',
                    EN: 'English',
                    SAVE_TO: 'Save to',
                    ADD_FOLDER: 'Add folder',
                    RECURSIVE: 'Recursive',
                    PARTS: 'Parts',
                    NO_PARTS: 'No parts',
                    CONFIGURATION_ERROR: 'Configuration error',
                    REQUIREMENTS_MISSING: 'Requirements not satisfied',
                    PART_NUMBER: 'Part number',
                    PART_NAME: 'Part name',
                    DESCRIPTION: 'Description',
                    DOCUMENT_ID: 'Document id',
                    DOCUMENT_TITLE: 'Document title',
                    SEARCH: 'Search',
                    USER: 'User login',
                    PASSWORD: 'Password',
                    HOST: 'Host',
                    PORT: 'Port',
                    ITEMS: 'item(s)',
                    LOADING_MORE: 'Loading more',
                    FOLDERS: 'Folders',
                    CHECKOUT_BY: 'Checked out by',
                    LAST_ACTION: 'Last action',
                    LAST_MODIFIED: 'Downloaded',
                    NO_CAD_FILE: 'No CAD file',
                    DELETE_FOLDER: 'Delete folder',
                    NO_FILES: 'Folder is empty',
                    FOLDER: 'Folder',
                    CONFIGURATION_MISSING: 'Configuration missing, please fill in the required fields',
                    FETCHING_WORKSPACES: 'Receiving workspaces list',
                    LATEST: 'Latest',
                    BASELINE: 'Baseline',
                    DELETE_FOLDER_CONFIRM_TITLE: 'Are you sure to want to remove this folder from list ?',
                    DELETE_FOLDER_CONFIRMED: 'Folder removed',
                    YES: 'Yes',
                    NO: 'No',
                    GREETINGS: 'Welcome',
                    PLEASE_LOG_IN: 'Please log in',
                    FILES: 'file(s)',
                    FAVORITE_FOLDERS: 'Favorite folders',
                    NO_FOLDERS: 'No folders',
                    CONNECTED_TO: 'connected to',
                    NEW_STUFF: 'New files',
                    AVAILABLE: 'Available',
                    CHECKED_OUT_BY_ME: 'Checked out by me',
                    RELEASED: 'Released',
                    LOCKED: 'Locked',
                    UP_TO_DATE: 'Up to date',
                    MODIFIED: 'Modified',
                    NOT_SYNC: 'Not synchronised',
                    LAST_WORKSPACES_VISITED: 'Last workspaces visited',
                    NOTHING_TO_SHOW: 'Nothing to show',
                    CONVERSION_STATUS: 'Conversion status',
                    PENDING: 'Pending',
                    SUCCESS: 'Success',
                    FAIL: 'Fail',
                    NO_CONVERSION: 'No conversion currently',
                    NO_ATTACHED_FILES: 'No attached files',
                    DOCUMENTS: 'Documents',
                    UNKNOWN: 'Unknown',
                    CHECKED_OUT: 'Checked out',
                    CHECKED_IN: 'Checked in',
                    HOME_FOLDER: 'Home folder',
                    ROOT_FOLDER: 'Root folder',
                    NO_DOCUMENTS: 'No documents',
                    DOWNLOADS_FINISHED: 'All downloads are finished',
                    SYNC_ALL: 'Synchronise all',
                    CHECKIN_MESSAGE: 'Add an iteration note',
                    DOWNLOAD_ALL: 'Download all files',
                    FILE_ANALYSIS: 'Files analysis',
                    DOWNLOADING: 'Download in progress',
                    SIZE: 'Size',
                    SEARCH_FOR_REPO: 'Scan repositories in local folders',
                    SELECT_FOLDER_TO_BROWSE: 'Select a folder',
                    ADD_ALL_REPO: 'Add all',
                    CLOSE: 'Close',
                    NO_REPO_MESSAGE: 'Sorry, nothing found in',
                    REPOSITORIES_FOUND: 'Repositories found',
                    LOGOUT: 'Log out',
                    SEARCH_REPO: 'Repositories search',
                    ECONNREFUSED: 'Connection to server refused. Please check server settings.',
                    ENOTFOUND: 'No server available for given host',
                    LOGIN_STATUS_403: 'Wrong login/password',
                    LOGIN_STATUS_200: 'Successfully logged out',
                    LOGIN_STATUS_500: 'Sorry, an unexpected error occurred. Please try again.',
                    OUT_OF_INDEX: 'Out of index',
                    FILTERS: 'Filters',
                    VERSION: 'Version',
                    ITERATION: 'Iteration',
                    NAME: 'Name',
                    TYPE: 'Type',
                    FILE: 'File',
                    INDEX: 'Index',
                    SELECTION: 'Selection',
                    SYNC_INDEX: 'Sync index',
                    DOWNLOAD_LATEST: 'Download latest version',
                    PUSH_UPDATES: 'Push updates',
                    SELECT_ALL: 'Select all',
                    UNSELECT_ALL: 'Unselect all',
                    OBSOLETE: 'Obsolete',
                    VIEW: 'View',
                    SHOW_EMPTY_DATA: 'Items without files',
                    REFRESH_WORKSPACE_DATA: 'Sync workspace data',
                    LEAVES: 'Leaves',
                    ASSEMBLIES: 'Assemblies',
                    CHOOSE_DESTINATION_FOLDER: 'Choose destination folder',
                    MENU_FOLDERS: 'This computer',
                    MENU_WORKSPACES: 'Remote workspaces',
                    ITEM_ID: 'Id / Number',
                    LAST_SYNC_DATE: 'Last synchronisation',
                    SYNC_RUNNING: 'Synchronizing data',
                    PAGINATION_LABELS_PAGE: 'Page',
                    PAGINATION_LABELS_ROWS_PER_PAGE: 'Rows per page',
                    PAGINATION_LABELS_OF: 'of',
                    ATTACHED_FILES: 'Attached files',
                    ADVANCED_OPTIONS: 'Advanced options',
                    FILES_TO_BE_DOWNLOADED: 'file(s) to be downloaded',
                    CANCEL: 'Cancel',
                    DONE: 'Done',
                    TO_FOLDER_VIEW: 'Display folder view',
                    RESET_SELECTION: 'Reset selection',
                    NATIVE_CAD_FILE: 'Native CAD file',
                    ID: 'Id',
                    SELECT_FOLDER: 'Select a folder',
                    LOCAL_CHANGES: 'Local changes',
                    HISTORY: 'History',
                    LATEST_EVENTS: 'Latest events in workspaces',
                    SYNC: 'Synchronize',
                    SYNC_WORKSPACES: 'Synchronize workspaces',
                    SYNC_INDEXES: 'Synchronize indexes',
                    MY_ACTIONS: 'My latest actions',
                    CREATED_BY: 'created by',
                    MODIFIED_BY: 'modified by',
                    CHECKED_IN_BY: 'checked in by',
                    CHECKED_OUT_BY: 'checked out by',
                    MODIFICATIONS: 'modification(s)',
                    REMOVE_FROM_FAVORITES: 'Remove from favorites',
                    ADD_TO_FAVORITES: 'Add to favorites',
                    SEARCH_IN_PARTS: 'Search in parts',
                    SEARCH_IN_DOCUMENTS: 'Search in documents',
                    LATEST_ACTION: 'Latest action',
                    NOT_YET_SYNC: 'Not synchronized',
                    NUMBER: 'Number',
                    OPEN_SHELL: 'Open terminal here',
                    BROWSE_WORKSPACE: 'Browse workspace',
                    FILES_TO_CHECK_IN: 'files to check in',
                    FILES_TO_CHECK_OUT: 'files to check out',
                    FILES_TO_UNDO_CHECK_OUT: 'files to undo check out',
                    FILES_TO_PUSH: 'files to push',
                    PUSH_MODIFICATIONS: 'Push modifications',
                    SAVE_NOTE: 'Save note',
                    CASCADE_CHECKIN: 'Cascade checkin',
                    CASCADE_CHECKOUT: 'Cascade checkout',
                    DOWNLOAD_FILES: 'Télécharger les fichiers',
                    CREATE_FILE: 'New file',
                    PUSH: 'Push files',
                    FILE_PREVIEW: 'Open file'
                })
                .translations('fr', {
                    CHECKOUT: 'Réserver',
                    CHECKIN: 'Libérer',
                    UNDO_CHECKOUT: 'Annuler la réservation',
                    PUT: 'Envoyer',
                    FORCE_REWRITE: 'Ecraser les fichiers existants',
                    CREATE_PART: 'Créer un nouvel article',
                    CREATE_DOCUMENT: 'Créer un nouveau document',
                    STANDARD: 'Article standard',
                    WORKSPACE: 'Espace de travail',
                    REFRESH_WORKSPACES: 'Rafraîchir la liste',
                    SAVE: 'Enregistrer',
                    OPEN_IN_EXPLORER: 'Ouvrir le dossier',
                    OPEN_IN_BROWSER: 'Ouvrir dans un navigateur',
                    FAVORITE: 'Favoris',
                    REFRESH_FOLDER: 'Rafraîchir le dossier',
                    DOWNLOAD: 'Télécharger',
                    HOME: 'Accueil',
                    SETTINGS: 'Paramètres',
                    LANG: 'Langue',
                    FR: 'Français',
                    EN: 'Anglais',
                    SAVE_TO: 'Enregistrer dans',
                    ADD_FOLDER: 'Ajouter un dossier',
                    RECURSIVE: 'Récursif',
                    PARTS: 'Articles',
                    NO_PARTS: 'Aucun article',
                    CONFIGURATION_ERROR: 'Erreur de configuration',
                    REQUIREMENTS_MISSING: 'Prérequis non satisfaits',
                    PART_NUMBER: 'Identifiant de l\'article',
                    PART_NAME: 'Nom de l\'article',
                    DESCRIPTION: 'Description',
                    DOCUMENT_ID: 'Identifiant du document',
                    DOCUMENT_TITLE: 'Titre du document',
                    SEARCH: 'Rechercher',
                    USER: 'Identifiant',
                    PASSWORD: 'Mot de passe',
                    HOST: 'Hôte',
                    PORT: 'Port',
                    ITEMS: 'entrée(s)',
                    LOADING_MORE: 'Chargement d\'entrées supplémentaires',
                    FOLDERS: 'Dossiers',
                    CHECKOUT_BY: 'Réservé par',
                    LAST_ACTION: 'Dernière action',
                    LAST_MODIFIED: 'Dernier téléchargement',
                    NO_CAD_FILE: 'Aucun fichier CAD',
                    DELETE_FOLDER: 'Supprimer le dossier',
                    NO_FILES: 'Le dossier est vide',
                    FOLDER: 'Dossier',
                    CONFIGURATION_MISSING: 'Configuration incomplète, veuillez renseigner les champs obligatoires',
                    FETCHING_WORKSPACES: 'Récupération de la liste des espaces de travail ...',
                    LATEST: 'Dernière',
                    BASELINE: 'Baseline',
                    DELETE_FOLDER_CONFIRM_TITLE: 'Êtes-vous sûr de vouloir supprimer ce dossier de la liste ?',
                    DELETE_FOLDER_CONFIRMED: 'Dossier supprimé',
                    YES: 'Oui',
                    NO: 'Non',
                    GREETINGS: 'Bienvenue',
                    PLEASE_LOG_IN: 'Veuillez vous connecter',
                    FILES: 'fichier(s)',
                    FAVORITE_FOLDERS: 'Dossiers favoris',
                    NO_FOLDERS: 'Aucun dossier',
                    CONNECTED_TO: 'connecté à',
                    NEW_STUFF: 'Nouveaux fichiers',
                    AVAILABLE: 'Disponible',
                    CHECKED_OUT_BY_ME: 'Réservé par moi',
                    RELEASED: 'Finalisée',
                    LOCKED: 'Vérrouillé',
                    UP_TO_DATE: 'À jour',
                    MODIFIED: 'Modifié',
                    NOT_SYNC: 'Non synchronisé',
                    LAST_WORKSPACES_VISITED: 'Derniers espaces de travail utilisés',
                    NOTHING_TO_SHOW: 'Aucune entrée',
                    CONVERSION_STATUS: 'Statut de la conversion',
                    PENDING: 'En cours',
                    SUCCESS: 'Succès',
                    FAIL: 'Echoué',
                    NO_CONVERSION: 'Pas de conversion en cours',
                    NO_ATTACHED_FILES: 'Pas de fichiers joints',
                    DOCUMENTS: 'Documents',
                    NO_DOCUMENTS: 'Aucun document',
                    UNKNOWN: 'Inconnus',
                    CHECKED_OUT: 'Réservés',
                    CHECKED_IN: 'Libérés',
                    HOME_FOLDER: 'Dossier personnel',
                    ROOT_FOLDER: 'Dossier racine',
                    DOWNLOADS_FINISHED: 'Tous les téléchargements sont terminés',
                    SYNC_ALL: 'Tout synchroniser',
                    CHECKIN_MESSAGE: 'Ajouter une note d\'itération',
                    DOWNLOAD_ALL: 'Télécharger tous les fichiers',
                    FILE_ANALYSIS: 'Analyse des fichiers',
                    DOWNLOADING: 'Téléchargement en cours',
                    SIZE: 'Taille',
                    SEARCH_FOR_REPO: 'Rechercher des dépots plm dans un dossier local',
                    SELECT_FOLDER_TO_BROWSE: 'Séléctionner un dossier',
                    ADD_ALL_REPO: 'Tout ajouter',
                    CLOSE: 'Fermer',
                    NO_REPO_MESSAGE: 'Désolé, aucun dépôt trouvé dans',
                    REPOSITORIES_FOUND: 'Dépots trouvés',
                    LOGOUT: 'Déconnexion',
                    SEARCH_REPO: 'Chercher un dépot',
                    ECONNREFUSED: 'Le serveur a refusé la connection. Vérifier les paramètres serveur.',
                    ENOTFOUND: 'Aucun serveur disponible pour la configuration donnée',
                    LOGIN_STATUS_403: 'Mauvais identifiant/mot de passe',
                    LOGIN_STATUS_200: 'Vous avez bien été déconnecté',
                    LOGIN_STATUS_500: 'Désolé, une erreur inattendue s\'est produite. Merci de ré-essayer à nouveau.',
                    OUT_OF_INDEX: 'Non versionnés',
                    FILTERS: 'Filtres',
                    VERSION: 'Version',
                    ITERATION: 'Itération',
                    NAME: 'Nom',
                    TYPE: 'Type',
                    FILE: 'Fichier',
                    INDEX: 'Index',
                    SELECTION: 'Sélection',
                    SYNC_INDEX: 'Synchroniser l\'index',
                    DOWNLOAD_LATEST: 'Télécharger les dernières versions',
                    PUSH_UPDATES: 'Envoyer les modifications',
                    SELECT_ALL: 'Tout sélectionner',
                    UNSELECT_ALL: 'Tout déselectionner',
                    OBSOLETE: 'Obsolète',
                    VIEW: 'Vue',
                    SHOW_EMPTY_DATA: 'Objets sans fichiers',
                    REFRESH_WORKSPACE_DATA: 'Synchroniser les données',
                    LEAVES: 'Feuilles',
                    ASSEMBLIES: 'Assemblages',
                    CHOOSE_DESTINATION_FOLDER: 'Choisir un dossier de destination',
                    MENU_FOLDERS: 'Cet ordinateur',
                    MENU_WORKSPACES: 'Espaces distants',
                    ITEM_ID: 'Identifiant',
                    LAST_SYNC_DATE: 'Dernière synchronisation',
                    SYNC_RUNNING: 'Synchronisation en cours',
                    PAGINATION_LABELS_PAGE: 'Page',
                    PAGINATION_LABELS_ROWS_PER_PAGE: 'Lignes par page',
                    PAGINATION_LABELS_OF: 'sur',
                    ATTACHED_FILES: 'Fichiers joints',
                    ADVANCED_OPTIONS: 'Options avancées',
                    FILES_TO_BE_DOWNLOADED: 'fichier(s) à télécharger',
                    CANCEL: 'Annuler',
                    DONE: 'Terminé',
                    TO_FOLDER_VIEW: 'Afficher le dossier',
                    RESET_SELECTION: 'Effacer la sélection',
                    NATIVE_CAD_FILE: 'Fichier CAD',
                    ID: 'Identifiant',
                    SELECT_FOLDER: 'Sélectionner un dossier',
                    LOCAL_CHANGES: 'Changements locaux',
                    HISTORY: 'Historique',
                    LATEST_EVENTS: 'Derniers changements dans l\'espace de travail',
                    SYNC: 'Synchroniser',
                    SYNC_WORKSPACES: 'Synchroniser l\'espace de travail distant',
                    SYNC_INDEXES: 'Synchroniser les index locaux',
                    MY_ACTIONS: 'Mes dernières actions',
                    CREATED_BY: 'créé par',
                    MODIFIED_BY: 'modifié par',
                    CHECKED_IN_BY: 'libéré par',
                    CHECKED_OUT_BY: 'réservé par',
                    MODIFICATIONS: 'modification(s)',
                    REMOVE_FROM_FAVORITES: 'Retirer des favoris',
                    ADD_TO_FAVORITES: 'Ajouter aux favoris',
                    SEARCH_IN_PARTS: 'Rechercher dans les articles',
                    SEARCH_IN_DOCUMENTS: 'Rechercher dans les documents',
                    LATEST_ACTION: 'Dernière activité',
                    NOT_YET_SYNC: 'Non synchronisé',
                    NUMBER: 'Numéro',
                    OPEN_SHELL: 'Ouvrir dans un terminal',
                    BROWSE_WORKSPACE: 'Parcourir l\'espace de travail',
                    FILES_TO_CHECK_IN: 'fichiers à libérer',
                    FILES_TO_CHECK_OUT: 'fichiers à réserver',
                    FILES_TO_UNDO_CHECK_OUT: 'fichiers à annuler',
                    FILES_TO_PUSH: 'fichiers à uploader',
                    PUSH_MODIFICATIONS: 'Uploader les fichiers modifiés',
                    SAVE_NOTE: 'Sauvegarder la note',
                    CASCADE_CHECKIN: 'Libération en cascade',
                    CASCADE_CHECKOUT: 'Réservation en cascade',
                    DOWNLOAD_FILES: 'Download files',
                    CREATE_FILE: 'Nouveau fichier',
                    PUSH: 'Téléverser les fichiers',
                    FILE_PREVIEW: 'Ouvrir le fichier'
                });

            $translateProvider.preferredLanguage(localStorage.lang || 'en');

        });
})();
