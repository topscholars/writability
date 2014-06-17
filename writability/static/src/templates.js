Ember.TEMPLATES["core/application"] = Ember.Handlebars.compile("{{outlet header}}\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\" {{bind-attr class=\"modalActive:active\"}}>\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/editor"] = Ember.Handlebars.compile("<div id=\"editor-layout\" class=\"layout\">\n    <section id=\"editor-module\" class=\"module\">{{outlet editor-module}}</section>\n</div>\n");

Ember.TEMPLATES["core/layouts/main"] = Ember.Handlebars.compile("<div id=\"main-layout\" class=\"layout\">\n    <section id=\"left-side\" class=\"outlet\">\n        {{outlet left-side-outlet}}\n    </section>\n    <section id=\"right-side\" class=\"outlet\">\n        {{outlet right-side-outlet}}\n    </section>\n</div>\n\n\n<!--\n<div id=\"main-layout\" class=\"layout\">\n    <section id=\"list-module\" class=\"module\">\n        {{outlet list-module}}\n    </section>\n    <section id=\"details-module\" class=\"module\">\n        {{outlet details-module}}\n    </section>\n</div>\n\n-->");

Ember.TEMPLATES["core/modules/details"] = Ember.Handlebars.compile("<nav class=\"details-nav\">\n    {{#each tab in view.tabs}}\n        <div id=\"tab-{{unbound tab.key}}\" {{action \"selectTab\" tab.key\n        target=\"view\"}} class=\"tab-header\">\n            {{tab.title}}\n        </div>\n    {{/each}}\n</nav>\n\n<div class=\"tab-content\">\n    {{view view.tabsViewClass viewName=\"tabsView\"}}\n</div>\n");

Ember.TEMPLATES["core/modules/editor"] = Ember.Handlebars.compile("\n");

Ember.TEMPLATES["core/modules/header"] = Ember.Handlebars.compile("<div class=\"temp_logout\">  \n  <a href=\"/logout\">Logout</a>\n</div>\n<div class=\"header-title\">{{view.title}}</div>\n");

Ember.TEMPLATES["core/modules/list"] = Ember.Handlebars.compile("<div class=\"module-title\">{{view.title}}</div>\n<ol class=\"list\">\n{{#each}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n{{/each}}\n\n{{#if view.newItem}}\n    {{view view.newItem}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["core/modules/nav_header"] = Ember.Handlebars.compile("<div class=\"nav-section left-nav\">{{view App.LeftNavButton}}</div>\n<div class=\"temp_logout\">  \n  <a href=\"/logout\">Logout</a>\n</div>\n<div class=\"header-title\">{{view.title}}</div>\n<div class=\"nav-section right-nav\">{{view App.RightNavButton}}</div>\n");

Ember.TEMPLATES["core/select-prompt"] = Ember.Handlebars.compile("<h3>Please Select An Item From the Left</h3>\n");

Ember.TEMPLATES["modules/_application_essay_templates-list-item"] = Ember.Handlebars.compile("\n{{#each t in application_essay_templates }}\n    <li class=\"list-item\">\n        <strong>{{../name}}</strong>: {{dotdotfifty t.essay_prompt}}\n    </li>\n{{/each}}\n");

Ember.TEMPLATES["modules/_draft-details-panel"] = Ember.Handlebars.compile("<div class=\"panel-title\">Details</div>\n\n{{#with essay}}\n<div class=\"details-field\">\n    <span class=\"key\">Audience:</span>\n    <span class=\"value app-text\">{{audience}}</span>\n</div>\n<div class=\"details-field\">\n    <span class=\"key\">Context:</span >\n    <span class=\"value app-text\">{{context}}</span>\n</div>\n<div class=\"details-field\">\n    <span class=\"key\">Topic:</span>\n    <span class=\"value app-text\">{{topic}}</span>\n</div>\n<div class=\"details-field\">\n    <span class=\"key\">Theme:</span>\n    <span class=\"value app-text\">{{theme.name}} ({{theme.category}})</span>\n</div>\n{{/with}}\n");

Ember.TEMPLATES["modules/_draft-review-panel"] = Ember.Handlebars.compile("<div class=\"panel-title\">Review</div>\n\n{{#if reviewMode}}\n    {{textarea class=\"review-editor\" value=review.text}}\n{{else}}\n    <p>{{currentReview.text}}</p>\n{{/if}}\n");

Ember.TEMPLATES["modules/_essay-app-tab-list-item"] = Ember.Handlebars.compile("<li class=\"tab-list-item\">\n    <div class=\"tab-li-field app-text\">{{essay_template.university.name}}:</div>\n    <div class=\"tab-li-field\">{{essay_prompt}}</div>\n    {{#if theme_essays}}\n        <div class=\"tab-li-field\">Also with:\n        {{#each theme_essay in theme_essays}}\n            {{theme_essay.essay_template.theme.name}}\n            ({{theme_essay.essay_template.theme.category}}),\n        {{/each}}\n        </div>\n    {{/if}}\n</li>\n");

Ember.TEMPLATES["modules/_essay-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Prompt:</div>\n    <div class=\"value app-text\">{{essay_prompt}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div>\n    <div class=\"value app-text\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Context:</div>\n    <div class=\"value app-text\">{{context}}</div>\n</div>\n\n{{#if is_in_progress}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic:</div>\n        <div class=\"value student-text\">{{topic}}</div>\n    </div>\n\n    {{#if review}}\n        <button {{action openDraft}}>Read Draft</button>\n    {{else}}\n        <button {{action openDraft}}>Write Draft</button>\n    {{/if}}\n{{else}}\n    {{#if is_new_essay}}\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 1:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_0\"}}\n        </div>\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 2:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_1\"}}\n        </div>\n\n        <button {{action 'submitProposedTopics' model}}>Submit Proposed Topics</button>\n    {{else}}\n        <div class=\"key\">Topics Under Review</div>\n\n        <hr>\n\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 1:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_0\" disabled=true}}\n            {{! view App.ProposedTopicOne valueBinding=\"proposed_topic_0\"}}\n        </div>\n        <div class=\"details-field\">\n            <div class=\"key\">Topic 2:</div>\n            {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_1\" disabled=true}}\n        </div>\n    {{/if}}\n{{/if}}\n");

Ember.TEMPLATES["modules/_essays-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">{{id}} +7</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{theme.name}}</div>\n    <div class=\"sub-line\">{{theme.category}}</div>\n</div>\n<div class=\"arrow-icon\">&gt;</div>\n<div class=\"details-group\">\n    <div class=\"next-action\">{{next_action}}</div>\n    <div class=\"draft-due\">\n        Draft Due: &nbsp;\n                  {{#if draft_due_date}}\n                    {{formatDate draft_due_date}}\n                  {{else}}N/A{{/if}}\n    </div>\n    <div class=\"essay-due\">\n      Essay Due:  {{#if due_date}} {{formatDate due_date}}\n                  {{else}}         N/A             {{/if}}\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_invitation-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{email}}\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_student-details-overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Email:</div>\n    <div class=\"value app-text\">{{email}}</div>\n</div>\n\n{{#link-to 'student.essays.index'}}<button>See Essays</button>{{/link-to}}\n");

Ember.TEMPLATES["modules/_students-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{#link-to \"student\" this}}\n            {{name}}\n        {{/link-to}}\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_students-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{!-- it is necessary to use \"controller.\" because this is inside a \"with\" block in the template,\n              which changes the context. The default context is controller, but now it is set to the\n              parameter of the \"with\" statement  --}}\n        {{input type=\"text\" placeholder=\"Student's Email\" value=controller.invitedStudentEmail}}\n        <span {{action \"inviteStudentCont\"}} class=\"inviteStudent\">+</span>\n        <!-- onclick=\"alert('Hit the invitation endpoint!'); return false;\"  -->\n    </div>\n</div>\n");

Ember.TEMPLATES["modules/_universities-list-item"] = Ember.Handlebars.compile("<!-- <div class=\"list-style-group\">@{{index}}</div> -->\n<div class=\"main-group\">\n    <div class=\"main-line\">{{name}}</div>\n</div>\n");

Ember.TEMPLATES["modules/_universities-new-item"] = Ember.Handlebars.compile("<div class=\"main-group\">\n    <div class=\"main-line\">\n        {{view Ember.Select\n        content=universities\n        selectionBinding=\"newUniversity\"\n        optionValuePath=\"content.id\"\n        valueBinding=\"defaultValueOption\"\n        optionLabelPath=\"content.name\"\n        prompt=\"Select a school\"}}\n    </div>\n</div>\n\n");

Ember.TEMPLATES["modules/draft"] = Ember.Handlebars.compile("<div class=\"editor-column summary-column\">\n    <section class=\"summary-header\">\n        <div class=\"panel-toggle-container\">\n            <button {{action togglePanel \"details\" target=view}} class=\"details panel-toggle\">\n                Details\n            </button>\n            <button {{action togglePanel \"review\" target=view}} class=\"review panel-toggle\">\n                Review\n            </button>\n        </div>\n        <div class=\"essay-prompt strong\">{{essay.essay_prompt}}</div>\n    </section>\n    <section class=\"summary-panel-container\">\n        {{view App.SummaryPanel viewName=\"summaryPanel\"}}\n    </section>\n</div>\n\n<div class=\"editor-column text-column\">\n    <div class=\"toolbar-container\">\n        <div id=\"editor-toolbar\" class=\"editor-toolbar\"></div>\n    </div>\n\n    {{#if reviewMode}}\n        {{view App.TextEditor\n            action=\"startedWriting\"\n            valueBinding=\"formatted_text\"\n            isReadOnly=true\n        }}\n    {{else}}\n        {{view App.TextEditor\n            action=\"startedWriting\"\n            valueBinding=\"formatted_text\"\n        }}\n    {{/if}}\n</div>\n\n<div class=\"editor-column annotations-column\">\n</div>\n");

Ember.TEMPLATES["modules/student/essay-layout"] = Ember.Handlebars.compile("<div class=\"module-title\">\n\t<h2>Essays</h2>\n\t<span class=\"student-info\">{{student.name}}</span>\n\t<button>Show</button>\n</div>\n{{#if actionRequiredEssays}}\n\t<h3>Take Action</h3>\n\t{{view App.StudentEssaysListView}}\n{{/if}}\n");

Ember.TEMPLATES["modules/student/essays/show/_overview"] = Ember.Handlebars.compile("<div class=\"details-field\">\n    <div class=\"key\">Prompt:</div>\n    <div class=\"value app-text\">{{essay_prompt}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div>\n    <div class=\"value app-text\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Context:</div>\n    <div class=\"value app-text\">{{context}}</div>\n</div>\n\n{{#if is_in_progress}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic:</div>\n        <div class=\"value student-text\">{{topic}}</div>\n    </div>\n\n    {{#if review}}\n        <button {{action openDraft}}>Read Draft</button>\n    {{else}}\n        <button {{action openDraft}}>Write Draft</button>\n    {{/if}}\n{{else}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic 1:</div>\n        {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_0\"}}\n    </div>\n\n    <div class=\"details-field\">\n        <div class=\"key\">Topic 2:</div>\n        {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_1\"}}\n    </div>\n\n    {{#if topicsReadyForApproval}}\n        <button {{action 'approveProposedTopics' model}}>Approve Topic</button>\n    {{else}}\n        <button {{action 'update' model}}>Save Topics</button>\n    {{/if}}\n{{/if}}\n<button {{action 'mergeEssay' model}}>Merge Essay</button>\n");

Ember.TEMPLATES["modules/student/essays/show/merge"] = Ember.Handlebars.compile("<div class=\"modal-content\">\n  <button class=\"close-button\" {{action 'closeModal'}}>X</button>\n  <div class=\"modal-title\">Merge Essays</div>\n  <div class=\"instructions\">\n  \t<p>Select the essays to merge into {{parentEssay.theme.name}}.</p>\n  \t<p>You'll only write to the Prompt and Topics for {{parentEssay.theme.name}}.</p>\n  </div>\n  <ul>\n  \t{{#each essay in mergeEssays}}\n  \t\t<li {{action 'toggleMergeSelected' essay}}>\n  \t\t\t{{essay.theme.name}}\n  \t\t</li>\n  \t{{/each}}\n  </ul>\n</div>\n");

Ember.TEMPLATES["modules/student/list"] = Ember.Handlebars.compile("<ol class=\"list\">\n{{#each}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n{{/each}}\n\n{{#if view.newItem}}\n    {{view view.newItem}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["modules/students"] = Ember.Handlebars.compile("{{#with students}}\n    {{view App.StudentsListView}}\n{{/with}}\n\n{{#with pendingInvitations}}\n    {{view App.InvitationsListView}}\n{{/with}}\n");

Ember.TEMPLATES["partials/_details-list"] = Ember.Handlebars.compile("<p>{{view.summaryText}}</p>\n\n{{#each application_essays}}\n    {{partial view.listItemPartial}}\n{{/each}}\n");

Ember.TEMPLATES["partials/button"] = Ember.Handlebars.compile("{{view.text}}");

Ember.TEMPLATES["partials/tags"] = Ember.Handlebars.compile("<div id=\"tag-box\">\n<input id=\"tag-search\">\n<div id=\"tag-menu\"></div>\n</div>\n");