Ember.TEMPLATES["application"] = Ember.Handlebars.compile("<header id=\"header\">{{outlet header}}</header>\n<div id=\"main-layout\">\n    <section id=\"list-module\">{{outlet list-module}}</section>\n    <section id=\"details-module\">{{outlet details-module}}</section>\n</div>\n<div id=\"editor-layout\">\n    <section id=\"editor-module\">{{outlet editor-module}}</section>\n</div>\n<div id=\"modal-container\">\n    <section id=\"modal-module\">{{outlet modal-module}}</section>\n</div>\n");

Ember.TEMPLATES["modules/details"] = Ember.Handlebars.compile("Build details pane\n\n{{audience}}\n\nsomething\n");

Ember.TEMPLATES["modules/header"] = Ember.Handlebars.compile("Writability Header\n");

Ember.TEMPLATES["modules/list"] = Ember.Handlebars.compile("{{view.title}}\n\n{{#each}}\n    <li>\n        {{partial view.listItem}}\n    </li>\n{{/each}}\n");

Ember.TEMPLATES["partials/essay-list-item"] = Ember.Handlebars.compile("<input type=\"checkbox\" class=\"toggle\">\n{{id}}\nasd {{word_count}}\n");