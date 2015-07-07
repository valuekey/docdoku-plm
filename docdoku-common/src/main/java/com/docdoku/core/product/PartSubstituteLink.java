/*
 * DocDoku, Professional Open Source
 * Copyright 2006 - 2015 DocDoku SARL
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
package com.docdoku.core.product;

import javax.persistence.*;
import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * This class is related to a {@link PartUsageLink}
 * to indicate a replacement part that could be used instead.
 * 
 * @author Florent Garin
 * @version 1.1, 16/10/11
 * @since   V1.1
 */
@Table(name="PARTSUBSTITUTELINK")
@Entity
@AssociationOverrides({
        @AssociationOverride(
                name="cadInstances",
                joinTable = @JoinTable(name="PARTSUBSTITUTELINK_CADINSTANCE",
                        inverseJoinColumns = {
                                @JoinColumn(name = "CADINSTANCE_ID", referencedColumnName = "ID")
                        },
                        joinColumns = {
                                @JoinColumn(name = "PARTSUBSTITUTELINK_ID", referencedColumnName = "ID")
                        }
                )
        )
})
@NamedQueries({
        @NamedQuery(name="PartSubstituteLink.findBySubstitute",query="SELECT u FROM PartSubstituteLink u WHERE u.substitute.number LIKE :partNumber AND u.substitute.workspace.id = :workspaceId"),
})
public class PartSubstituteLink extends PartLink implements Serializable, Cloneable {

    public PartSubstituteLink() {
    }

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name = "SUBSTITUTE_WORKSPACE_ID", referencedColumnName = "WORKSPACE_ID"),
            @JoinColumn(name = "SUBSTITUTE_PARTNUMBER", referencedColumnName = "PARTNUMBER")
    })
    private PartMaster substitute;

    @Override
    public PartSubstituteLink clone() {
        PartSubstituteLink clone = null;
        try {
            clone = (PartSubstituteLink) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new InternalError();
        }

        //perform a deep copy
        List<CADInstance> clonedCADInstances = new LinkedList<CADInstance>();
        for (CADInstance cadInstance : cadInstances) {
            CADInstance clonedCADInstance = cadInstance.clone();
            clonedCADInstances.add(clonedCADInstance);
        }
        clone.cadInstances = clonedCADInstances;

        return clone;
    }

    @Override
    public Character getCode() {
        return 's';
    }

    @Override
    public PartMaster getComponent() {
        return substitute;
    }

    @Override
    public boolean isOptional() {
        return false;
    }

    @Override
    public List<PartSubstituteLink> getSubstitutes() {
        return null;
    }

    public PartMaster getSubstitute() {
        return substitute;
    }

    public void setSubstitute(PartMaster substitute) {
        this.substitute = substitute;
    }
}
