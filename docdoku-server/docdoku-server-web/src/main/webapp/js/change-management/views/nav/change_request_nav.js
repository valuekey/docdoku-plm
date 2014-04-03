define([
	"common-objects/common/singleton_decorator",
    "text!templates/nav/change_request_nav.html",
    "i18n!localization/nls/change-management-strings",
	"views/change-requests/change_request_content"
], function (
	singletonDecorator,
    template,
    i18n,
    ChangeRequestContentView
) {
	var ChangeRequestNavView = Backbone.View.extend({

        template: Mustache.compile(template),

        el: "#request-nav",

        initialize: function () {
			this.render();
            this.contentView = undefined;
		},

        render:function(){
            this.$el.html(this.template({i18n:i18n}));
        },

        setActive: function () {
            if(APP_VIEW.$changeManagementMenu){
                APP_VIEW.$changeManagementMenu.find(".active").removeClass("active");
            }
			this.$el.find(".nav-list-entry").first().addClass("active");
		},

		showContent: function (elementId) {
			this.setActive();
            this.cleanView();
            this.contentView = new ChangeRequestContentView().render();
            $(elementId).html(this.contentView.el);
        },

        cleanView: function(){
            if(this.contentView){
                this.contentView.remove();
            }
        }
	});

    ChangeRequestView = singletonDecorator(ChangeRequestNavView);
	return ChangeRequestView;
});