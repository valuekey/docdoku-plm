define([
    "models/change_item"
], function(
    ChangeItemModel
    ){
    var ChangeOrderModel= ChangeItemModel.extend({
        urlRoot: "/api/workspaces/" + APP_CONFIG.workspaceId + "/changes/orders",

        getMilestoneId :function(){
            return this.get("milestoneId");
        },

        getAddressedChangeRequests : function(){
            return this.get("addressedChangeRequests");
        },

        saveAffectedRequests: function(requests, callback){
            $.ajax({
                context: this,
                type: "PUT",
                url: this.url() + "/affectedRequests",
                data: JSON.stringify(requests),
                contentType: "application/json; charset=utf-8",
                success: function() {
                    this.fetch();
                    if(callback){
                        callback();
                    }
                }
            });
        }
    });

    return ChangeOrderModel;
});