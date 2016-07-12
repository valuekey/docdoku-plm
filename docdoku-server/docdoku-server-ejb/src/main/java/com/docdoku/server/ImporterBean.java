package com.docdoku.server;


import com.docdoku.core.common.User;
import com.docdoku.core.product.ImportPreview;
import com.docdoku.core.product.ImportResult;
import com.docdoku.core.services.IImporterManagerLocal;
import com.docdoku.core.services.IUserManagerLocal;
import com.docdoku.server.importers.PartImporter;
import com.docdoku.server.importers.PathDataImporter;

import javax.ejb.AsyncResult;
import javax.ejb.Asynchronous;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.concurrent.Future;
import java.util.logging.Logger;

/**
 * Attributes importer
 *
 * @author Elisabel Généreux
 */
@Stateless(name = "ImporterBean")
public class ImporterBean implements IImporterManagerLocal {



    private static final Logger LOGGER = Logger.getLogger(ImporterBean.class.getName());

    @Inject
    @Any
    private Instance<PartImporter> partImporters;

    @Inject
    @Any
    private Instance<PathDataImporter> pathDataImporters;

    @EJB
    private IUserManagerLocal userManager;

    @Override
    @Asynchronous
    @FileImport
    public Future<ImportResult> importIntoParts(String workspaceId, File file, String originalFileName, String revisionNote, boolean autoCheckout, boolean autoCheckin, boolean permissiveUpdate) throws Exception{
        PartImporter selectedImporter = null;

        for (PartImporter importer : partImporters) {
            if (importer.canImportFile(file.getName())) {
                selectedImporter = importer;
                break;
            }
        }

        ImportResult result;

        User user = userManager.whoAmI(workspaceId);
        Locale locale = new Locale(user.getLanguage());

        if (selectedImporter != null) {
            result = selectedImporter.importFile(workspaceId, file, revisionNote, autoCheckout, autoCheckin, permissiveUpdate);
        } else {
            result = getNoImporterAvailableError(file, originalFileName,locale);
        }

        return new AsyncResult<>(result);
    }

    @Override
    @Asynchronous
    @FileImport
    public Future<ImportResult> importIntoPathData(String workspaceId, File file, String originalFileName, String revisionNote, boolean autoFreezeAfterUpdate, boolean permissiveUpdate) throws Exception{
        PathDataImporter selectedImporter = null;

        for (PathDataImporter importer : pathDataImporters) {
            if (importer.canImportFile(file.getName())) {
                selectedImporter = importer;
                break;
            }
        }

        ImportResult result;

        if (selectedImporter != null) {
            result = selectedImporter.importFile(workspaceId, file, revisionNote, autoFreezeAfterUpdate, permissiveUpdate);
        } else {

            User user = userManager.whoAmI(workspaceId);
            Locale locale = new Locale(user.getLanguage());
            result = getNoImporterAvailableError(file, originalFileName,locale);
        }

        return new AsyncResult<>(result);
    }

    @Override
    public ImportPreview dryRunImportIntoParts(String workspaceId, File file, String originalFileName, boolean autoCheckout, boolean autoCheckin, boolean permissiveUpdate) throws Exception {

        PartImporter selectedImporter = null;

        for (PartImporter importer : partImporters) {
            if (importer.canImportFile(file.getName())) {
                selectedImporter = importer;
                break;
            }
        }

        ImportPreview result = null;

        if (selectedImporter != null) {
            result = new ImportPreview();
            result.setPartRevisions(selectedImporter.dryRunImport(workspaceId,file,originalFileName,autoCheckout, autoCheckin, permissiveUpdate));
        }

        return result;

    }

    public ImportResult getNoImporterAvailableError(File file, String fileName, Locale locale) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        errors.add(ResourceBundle.getBundle("com.docdoku.core.i18n.LocalStrings", locale).getString("NoImporterAvailable"));
        ImportResult result = new ImportResult(file, fileName, warnings, errors);
        return result;
    }
}
