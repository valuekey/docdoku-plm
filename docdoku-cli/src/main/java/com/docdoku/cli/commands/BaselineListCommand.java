/*
 * DocDoku, Professional Open Source
 * Copyright 2006 - 2013 DocDoku SARL
 *
 * This file is part of DocDokuPLM.
 *
 * DocDokuPLM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DocDokuPLM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with DocDokuPLM.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.docdoku.cli.commands;

import com.docdoku.cli.ScriptingTools;
import com.docdoku.cli.helpers.JSONOutput;
import com.docdoku.core.configuration.Baseline;
import com.docdoku.core.product.PartRevisionKey;
import com.docdoku.core.services.IProductManagerWS;
import org.kohsuke.args4j.Option;

import java.util.List;

/**
 *
 * @author Morgan Guimard
 */
public class BaselineListCommand extends AbstractCommandLine {

    @Option(name="-w", aliases = "--workspace", required = true, metaVar = "<workspace>", usage="workspace on which operations occur")
    protected String workspace;

    @Option(metaVar = "<partnumber>", required = true, name = "-o", aliases = "--part", usage = "the part number of the part to fetch; if not specified choose the part corresponding to the cad file")
    private String number;

    @Option(metaVar = "<revision>", required = true, name="-r", aliases = "--revision", usage="specify revision of the part to retrieve ('A', 'B'...); default is the latest")
    private String revision;

    private IProductManagerWS productS;

    @Override
    public Object execImpl() throws Exception {

        productS = ScriptingTools.createProductService(getServerURL(), user, password);
        PartRevisionKey pK = new PartRevisionKey(workspace,number,revision);
        List<Baseline> baselines = productS.findBaselinesWherePartRevisionHasIterations(pK);
        return JSONOutput.printBaselines(baselines);
    }

    @Override
    public String getDescription() {
        return "Retrieve all baselines where part revision has some iterations";
    }
}