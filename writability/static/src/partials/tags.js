
App.TagBox = Ember.View.extend({
    templateName: 'partials/tags',
    didInsertElement: initializeTagBox
});

$.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
        this._super();
        this.widget().menu( "option", "items",
                            "> :not(.ui-autocomplete-category)" );
    },
    _renderItem: function( ul, item ) {
        var type = item.tag_type.toLowerCase();
        return $( "<li>" )
            .append( $( "<a class=\"tag-" + type + "\">" ).text(item.label))
            .appendTo( ul );
    },
    _renderMenu: function( ul, items ) {
        var that = this;
        var currentCategory = "";
        $.each( items, function( index, item ) {
            if ( item.category != currentCategory ) {
                ul.append( "<li class='ui-autocomplete-category'>"
                           + item.category + " :</li>" );
                currentCategory = item.category;
            }
            var li = that._renderItemData( ul, item );
            if ( item.category ) {
                li.attr( "aria-label", item.category + " : " + item.label );
            }
        });
    }
});

function initializeTagBox() {
    var data = [
        { label: "anders", category: "Random", tag_type: "POSITIVE"},
        { label: "andreas", category: "Random", tag_type: "NEGATIVE"},
        { label: "antal", category: "Random", tag_type: "POSITIVE" },
        { label: "annhhx10", category: "Products", tag_type: "NEGATIVE" },
        { label: "annk K12", category: "Products", tag_type: "NEUTRAL" },
        { label: "annttop C13", category: "Products", tag_type: "NEGATIVE" },
        { label: "anders andersson", category: "People", tag_type: "POSITIVE" },
        { label: "andreas andersson", category: "People", tag_type: "NEGATIVE" },
        { label: "andreas johnson", category: "People", tag_type: "POSITIVE" }
    ];

    var filter = function(request, response) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( $.grep( data, function(value) {
            return matcher.test( value.category + ' ' + value.label );
        } ) );
    }

    var catcomplete = $( "#tag-search" ).catcomplete({
        delay: 0,
        appendTo: '#tag-menu',
        source: filter,
        select: function(event, ui) {
            alert( ui.item.label );
        },
        position: { my: 'left top', at: 'left top', of: '#tag-menu' }
    });
}
