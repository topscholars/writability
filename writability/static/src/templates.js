Ember.TEMPLATES["application"] = Ember.Handlebars.compile("<header id=\"header\">{{outlet header}}</header>\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\">\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n");

Ember.TEMPLATES["layouts/editor"] = Ember.Handlebars.compile("<div id=\"editor-layout\" class=\"layout\">\n    <section id=\"editor-module\" class=\"module\">{{outlet editor-module}}</section>\n</div>\n");

Ember.TEMPLATES["layouts/main"] = Ember.Handlebars.compile("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"list-module\" class=\"module\">\n        {{outlet list-module}}\n    </section>\n    <section id=\"details-module\" class=\"module\">\n        {{outlet details-module}}\n    </section>\n</div>\n");

Ember.TEMPLATES["modules/details"] = Ember.Handlebars.compile("<nav class=\"details-nav\">\n    {{#each tab in view.tabs}}\n        <div id=\"tab-{{unbound tab.key}}\" {{action \"select\" tab.key\n        target=\"view\"}} class=\"tab-header\">\n            {{tab.title}}\n        </div>\n    {{/each}}\n</nav>\n<div class=\"tab-content\">\n    {{view App.EssayTabs}}\n</div>\n");

Ember.TEMPLATES["modules/editor"] = Ember.Handlebars.compile("some stuff here\n");

Ember.TEMPLATES["modules/header"] = Ember.Handlebars.compile("<div class=\"header-title\">Writability</div>\n");

Ember.TEMPLATES["modules/list"] = Ember.Handlebars.compile("<div class=\"module-title\">{{view.title}}</div>\n<ol class=\"list\">\n{{#each}}\n    <li {{action \"select\"}} {{bind-attr class=\":list-item isSelected\"}}>\n        {{partial view.listItem}}\n    </li>\n{{/each}}\n</ol>\n");

Ember.TEMPLATES["partials/essay-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n");

Ember.TEMPLATES["partials/essay-list-item"] = Ember.Handlebars.compile("<div class=\"list-style-group\">{{id}} +7</div>\n<div class=\"main-group\">\n    <div class=\"main-line\">Theme</div>\n    <div class=\"sub-line\">Category</div>\n</div>\n<div class=\"arrow-icon\">&gt;</div>\n<div class=\"details-group\">\n    <div class=\"next-action\">Start Topic</div>\n    <div class=\"draft-due\">Draft Due: May 3, 2014</div>\n    <div class=\"essay-due\">Essay Due: {{due_date}}</div>\n</div>\n");