Ember.TEMPLATES["core/application"] = Ember.Handlebars.compile("{{outlet header}}\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\">\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/editor"] = Ember.Handlebars.compile("<div id=\"editor-layout\" class=\"layout\">\n    <section id=\"editor-module\" class=\"module\">{{outlet editor-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/main"] = Ember.Handlebars.compile("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"left-side\" class=\"outlet\">\n        {{outlet left-side-outlet}}\n    </section>\n    <section id=\"right-side\" class=\"outlet\">\n        {{outlet right-side-outlet}}\n    </section>\n</div>\n\n\n<!--\n<div id=\"main-layout\" class=\"layout\">\n    <section id=\"list-module\" class=\"module\">\n        {{outlet list-module}}\n    </section>\n    <section id=\"details-module\" class=\"module\">\n        {{outlet details-module}}\n    </section>\n</div>\n\n-->");

Ember.TEMPLATES["core/modules/details"] = Ember.Handlebars.compile("<nav class=\"details-nav\">\n    {{#each tab in view.tabs}}\n        <div id=\"tab-{{unbound tab.key}}\" {{action \"select\" tab.key\n        target=\"view\"}} class=\"tab-header\">\n            {{tab.title}}\n        </div>\n    {{/each}}\n</nav>\n<div class=\"tab-content\">\n    {{view App.EssayTabs}}\n</div>\n");

Ember.TEMPLATES["core/modules/editor"] = Ember.Handlebars.compile("\n");

Ember.TEMPLATES["core/modules/header"] = Ember.Handlebars.compile("<div class=\"header-title\">{{view.title}}</div>\n");

Ember.TEMPLATES["core/modules/list"] = Ember.Handlebars.compile("<div class=\"module-title\">{{view.title}}</div>\n<ol class=\"list\">\n{{#each}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n{{/each}}\n\n{{#if view.newItem}}\n    {{view view.newItem}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["core/modules/nav_header"] = Ember.Handlebars.compile("<div class=\"nav-section left-nav\">{{view App.LeftNavButton text=\"< Back\"}}</div>\n<div class=\"header-title\">{{view.title}}</div>\n<div class=\"nav-section right-nav\">{{view App.RightNavButton text=\"Next >\"}}</div>\n");

Ember.TEMPLATES["modules/_application_essay_templates-list-item"] = Ember.Handlebars.compile("\n{{#each t in application_essay_templates }}\n    <strong>{{../name}}</strong>: {{dotdotfifty t.essay_prompt}}\n    <br />\n{{/each}}");

Ember.TEMPLATES["modules/_draft-details-panel"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">foo:</div> <div class=\"value\">bar</div>\n</div>\n");

Ember.TEMPLATES["modules/_essay-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div> <div class=\"value\">{{audience}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_essays-list-item"] = Ember.Handlebars.compile("<div class=\"list-style-group\">{{id}} +7</div>\n<div class=\"main-group\">\n    <div class=\"main-line\">Theme</div>\n    <div class=\"sub-line\">Category</div>\n</div>\n<div class=\"arrow-icon\">&gt;</div>\n<div class=\"details-group\">\n    <div class=\"next-action\">Start Topic</div>\n    <div class=\"draft-due\">Draft Due: May 3, 2014</div>\n    <div class=\"essay-due\">Essay Due: {{due_date}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_students-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{name}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_students-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{view Ember.TextField placeholder=\"Student's Email\" valueBinding=\"invitedStudentEmail\"}}\n\n        <span {{action \"inviteStudentCont\"}} class=\"inviteStudent\">+</span>\n\n        <!-- onclick=\"alert('Hit the invitation endpoint!'); return false;\"  -->\n    </div>\n</div>");

Ember.TEMPLATES["modules/_universities-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{name}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_universities-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{view Ember.Select\n        content=universities\n        selectionBinding=\"newUniversity\"\n        optionValuePath=\"content.id\"\n        valueBinding=\"defaultValueOption\"\n        optionLabelPath=\"content.name\"\n        prompt=\"Select a school\"}}\n    </div>\n</div>\n\n");

Ember.TEMPLATES["modules/draft"] = Ember.Handlebars.compile("<div class=\"editor-column summary-column\">\n    <div class=\"editor-toggles\">\n        <button {{action editorToggle}} class=\"editor-toggle\">Details</button>\n        <button {{action editorToggle}} class=\"editor-toggle\">Review</button>\n    </div>\n    <div class=\"essay-prompt strong\">{{essay.essay_prompt}}</div>\n</div>\n\n<div class=\"editor-column text-column\">\n    <div class=\"toolbar-container\">\n        <div id=\"editor-toolbar\" class=\"editor-toolbar\"></div>\n    </div>\n    {{view App.TextEditor action=\"startedWriting\" valueBinding=\"formatted_text\"}}\n</div>\n\n<div class=\"editor-column annotations-column\">\n</div>\n");

Ember.TEMPLATES["partials/button"] = Ember.Handlebars.compile("{{view.text}}");