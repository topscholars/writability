Ember.TEMPLATES["components/annotation-container"] = Ember.Handlebars.compile("{{#each annotationGroup in existingAnnotationGroups}}\n\t{{annotation-groupcontainer group=annotationGroup isStudent=isStudent}}\n{{/each}}\n\n{{#if newAnnotation}}\n\t{{annotation-createbox annotation=newAnnotation tags=tags hasSavedAnnotation=\"hasSavedAnnotation\"}}\n{{/if}}\n");

Ember.TEMPLATES["components/annotation-createbox"] = Ember.Handlebars.compile("{{#if tag}}\n<div class=\"annotation-create\">\n\t<span {{bind-attr class=\":annotation-create-tag-selected tag.isPositive:tag-positive:tag-negative\"}}>{{tag.name}} <i class=\"icon-info-circled\" {{action \"toggleCollapse\"}}></i></span>\n\n\t{{#general-collapse isActive=collapseActive}}\n\t\t{{annotation.tag.description}}\n\t{{/general-collapse}}\n\n\t{{textarea value=comment class=\"annotation-create-comment\"}}\n\n\t<button class=\"annotation-create-button\" {{action \"saveAnnotation\"}}>Tag It</button>\n</div>\n{{else}}\n\t{{autosuggest-tag data=tags value=tagId}}\n{{/if}}\n");

Ember.TEMPLATES["components/annotation-detail"] = Ember.Handlebars.compile("<span class=\"annotaion-close\" {{action 'closeAnnotation'}}><i class=\"icon-cancel-circled\"></i></span>\n\n<span {{bind-attr class=\":annotation-details-tag-selected annotation.isPositive:tag-positive:tag-negative\"}}>{{annotation.tag.name}} <i class=\"icon-info-circled\" {{action \"toggleCollapse\"}}></i></span>\n\n{{#general-collapse isActive=collapseActive}}\n\t{{annotation.tag.description}}\n{{/general-collapse}}\n\n<p class=\"annotation-details-comment\">{{annotation.comment}}</p>\n\n<p class=\"annotation-details-comment\">Original: \"{{annotation.original}}\"</p>\n\n{{#if isStudent}}\n  {{#unless annotation.isResolved}}\n\t  <button class=\"annotation-details-button\" {{action \"resolveAnnotation\"}}>Resolve</button>\n  {{else}}\n    <p class=\"bold\">[Resolved]</p>\n  {{/unless}}\n{{else}}\n  {{#unless annotation.isApproved}}\n    <button class=\"annotation-details-button\" {{action \"approveAnnotation\"}}>Approve</button>\n  {{else}}\n    <p class=\"bold\">[Approved]</p>\n  {{/unless}}\n{{/if}}\n");

Ember.TEMPLATES["components/annotation-groupcontainer"] = Ember.Handlebars.compile("{{#each annotation in group.annotations}}\n\t<div {{bind-attr class=\":annotation-title annotation.isPositive:tag-positive:tag-negative annotation.isResolved:tag-resolved\"}} {{action 'selectAnnotation' annotation}}>{{annotation.tag.name}}</div>\n{{/each}}\n{{#if selectedAnnotation}}\n\t{{annotation-detail annotation=selectedAnnotation top=group.top isStudent=isStudent closeAnnotation=\"closeAnnotation\"}}\n{{/if}}\n");

Ember.TEMPLATES["components/general-collapse"] = Ember.Handlebars.compile("{{yield}}\n");

Ember.TEMPLATES["components/is-in-array-checkbox"] = Ember.Handlebars.compile("<div class=\"checkbox\">\n\t{{#if isInArray}}\n\t\t<i class=\"icon-check\"></i>\n\t{{else}}\n\t\t<i class=\"icon-check inactive\"></i>\n\t{{/if}}\n</div>\n");

Ember.TEMPLATES["core/application"] = Ember.Handlebars.compile("{{outlet header}}\n<div id=\"layout-container\">{{outlet}}</div>\n<div id=\"modal-container\" {{bind-attr class=\"modalActive:active\"}}>\n    <section id=\"modal-module\" class=\"module\">{{outlet modal-module}}</section>\n</div>\n<div id=\"loading-container\" {{bind-attr class=\"loadingActive:active\"}}>\n\t<section id=\"loading-spinner\"></section>\n</div>\n");

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

Ember.TEMPLATES["modules/draft"] = Ember.Handlebars.compile("<div class=\"editor-column summary-column\">\n    <section class=\"summary-header\">\n        <div class=\"panel-toggle-container\">\n            <button {{action togglePanel \"details\" target=view}} class=\"details panel-toggle\">\n                Details\n            </button>\n            <button {{action togglePanel \"review\" target=view}} class=\"review panel-toggle\">\n                Review\n            </button>\n        </div>\n        <div class=\"essay-prompt strong\">{{essay.essay_prompt}}</div>\n    </section>\n    <section class=\"summary-panel-container\">\n        {{view App.SummaryPanel viewName=\"summaryPanel\"}}\n    </section>\n</div>\n\n<div class=\"editor-column text-column\">\n    <div class=\"toolbar-container\">\n        <div id=\"editor-toolbar\" class=\"editor-toolbar\"></div>\n    </div>\n\n    {{#if reviewMode}}\n        {{view App.TextEditor\n            action=\"startedWriting\"\n            valueBinding=\"formatted_text\"\n            isReadOnly=false\n            reviewMode=true\n            valueBuffer=formatted_text_buffer\n        }}\n    {{else}}\n        {{view App.TextEditor\n            action=\"startedWriting\"\n            valueBinding=\"formatted_text\"\n            valueBuffer=formatted_text_buffer\n        }}\n    {{/if}}\n</div>\n\n<div class=\"editor-column annotations-column\">\n    {{annotation-container\n        newAnnotation=newAnnotation\n        annotations=domAnnotations\n        tags=tags\n        hasSavedAnnotation=\"hasSavedAnnotation\"\n        isStudent=isStudent}}\n</div>\n");

Ember.TEMPLATES["modules/essay/_app-item"] = Ember.Handlebars.compile("<li {{bind-attr class=\":tab-list-item selected unselected\"}}>\n    <div class=\"tab-li-field app-text\">{{essay_template.university.name}}:</div>\n    <div class=\"tab-li-field\">{{essay_prompt}}</div>\n    {{#if theme_essays}}\n        <div class=\"tab-li-field\">Also with:\n        {{#each theme_essay in theme_essays}}\n            {{theme_essay.essay_template.theme.name}}\n            ({{theme_essay.essay_template.theme.category}}),\n        {{/each}}\n        </div>\n    {{/if}}\n</li>\n");

Ember.TEMPLATES["modules/essays/layout"] = Ember.Handlebars.compile("<div class=\"module-title\">\n\t<h2>Essays</h2>\n\t<span class=\"student-info\">{{student.name}}</span>\n</div>\n\n{{view App.EssaysListView}}\n");

Ember.TEMPLATES["modules/essays/list"] = Ember.Handlebars.compile("<ol class=\"list\">\n  {{#if actionRequiredEssays}}\n    <li class=\"legend\">Take Action</li>\n    {{#each actionRequiredEssays}}\n      {{view view.listItem classNameBindings=\"isSelected\" }}\n    {{/each}}\n  {{/if}}\n</ol>\n");

Ember.TEMPLATES["modules/student/essay-layout"] = Ember.Handlebars.compile("<div class=\"module-title\">\n\t<h2>Essays</h2>\n\t<span class=\"student-info\">{{student.name}}</span>\n\t{{#if showMergedEssays}}\n\t\t<button {{action 'toggleMergedEssays'}}>Hide Merged Essays</button>\n\t{{else}}\n\t\t<button {{action 'toggleMergedEssays'}}>Show Merged Essays</button>\n\t{{/if}}\n</div>\n\n{{view App.StudentEssaysListView}}\n");

Ember.TEMPLATES["modules/student/essays/list"] = Ember.Handlebars.compile("<ol class=\"list\">\n{{#if showMergedEssays}}\n  <li class=\"legend\">Merged</li>\n  {{#each mergedEssays}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n  {{/each}}\n{{else}}\n    {{#if actionRequiredEssays}}\n      <li class=\"legend\">Take Action</li>\n      {{#each actionRequiredEssays}}\n        {{view view.listItem classNameBindings=\"isSelected\" }}\n      {{/each}}\n    {{/if}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["modules/student/essays/show/_app-item"] = Ember.Handlebars.compile("<li {{bind-attr class=\":tab-list-item selected unselected\"}} {{action 'select'}}>\n    <div class=\"tab-li-field app-text\">{{essay_template.university.name}}:</div>\n    <div class=\"tab-li-field\">{{essay_prompt}}</div>\n    {{#if theme_essays}}\n        <div class=\"tab-li-field\">Also with:\n        {{#each theme_essay in theme_essays}}\n            {{theme_essay.essay_template.theme.name}}\n            ({{theme_essay.essay_template.theme.category}}),\n        {{/each}}\n        </div>\n    {{/if}}\n</li>\n");

Ember.TEMPLATES["modules/student/essays/show/_details-list"] = Ember.Handlebars.compile("<p>{{view.summaryText}}</p>\n\n{{#each application_essay in application_essays}}\n    {{render 'modules/student/essays/show/_app-item' application_essay}}\n{{/each}}\n");

Ember.TEMPLATES["modules/student/essays/show/_overview"] = Ember.Handlebars.compile("{{#if parent}}\n<div class=\"details-field\">\n    <div class=\"key\">Merged into Essay:</div>\n    <div class=\"value app-text\">{{parent.theme.name}}</div>\n</div>\n{{/if}}\n\n<div class=\"details-field\">\n    <div class=\"key\">Prompt:</div>\n    <div class=\"value app-text\">{{essay_prompt}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Audience:</div>\n    <div class=\"value app-text\">{{audience}}</div>\n</div>\n<div class=\"details-field\">\n    <div class=\"key\">Context:</div>\n    <div class=\"value app-text\">{{context}}</div>\n</div>\n\n{{#if merged_theme_essays}}\n<div class=\"details-field\">\n    <div class=\"key\">Merged into Essay:</div>\n    <ul>\n        {{#each mergedEssay in merged_theme_essays}}\n            <li>{{mergedEssay.theme.name}}</li>\n        {{/each}}\n    </ul>\n    <div class=\"value app-text\">{{parent.theme.name}}</div>\n</div>\n{{/if}}\n\n{{#if is_in_progress}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic:</div>\n        <div class=\"value student-text\">{{topic}}</div>\n    </div>\n{{else}}\n    <div class=\"details-field\">\n        <div class=\"key\">Topic 1:</div>\n        {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_0\"}}\n    </div>\n\n    {{#if topicsReadyForApproval}}\n        <button {{action 'approveProposedTopic' model 'proposed_topic_0'}}>Approve Topic 1</button>\n    {{/if}}\n\n    <div class=\"details-field\">\n        <div class=\"key\">Topic 2:</div>\n        {{textarea class=\"value student-text\" valueBinding=\"controller.proposed_topic_1\"}}\n    </div>\n\n    {{#if topicsReadyForApproval}}\n        <button {{action 'approveProposedTopic' model 'proposed_topic_1'}}>Approve Topic 2</button>\n    {{else}}\n        <button {{action 'update' model}}>Save Topics</button>\n    {{/if}}\n{{/if}}\n\n{{#if draft_ready_for_review}}\n    <button {{action 'reviewDraft' recentDraft}}>Review Draft</button>\n{{/if}}\n\n{{#if parent}}\n<button {{action 'splitEssay' model}}>Unmerge Essay</button>\n{{else}}\n<button {{action 'mergeEssay' model}}>Merge Essay</button>\n{{/if}}\n");

Ember.TEMPLATES["modules/student/essays/show/merge"] = Ember.Handlebars.compile("<div class=\"modal-content\">\n  <button class=\"close-button\" {{action 'closeModal'}}>X</button>\n  <div class=\"modal-title\">Merge Essays</div>\n  <div class=\"instructions\">\n  \t<p>Select the essays to merge into {{parentEssay.theme.name}}.</p>\n  \t<p>You'll only write to the Prompt and Topics for {{parentEssay.theme.name}}.</p>\n  </div>\n  <ul class=\"modal-list\">\n  \t{{#each essay in mergeEssays}}\n  \t\t<li {{action 'toggleMergeSelected' essay}}>\n        {{is-in-array-checkbox list=parentEssay.merged_theme_essays target=essay}}\n  \t\t\t<div class=\"main-group\">\n          <div class=\"main-line\">{{essay.theme.name}}</div>\n          <div class=\"sub-line\">{{essay.theme.category}}</div>\n        </div>\n  \t\t</li>\n  \t{{/each}}\n  </ul>\n  <div class=\"modal-actions\">\n    <button class=\"double-column\" {{action 'mergeEssays' parentEssay}}>Merge &gt;</button>\n  </div>\n</div>\n");

Ember.TEMPLATES["modules/student/list"] = Ember.Handlebars.compile("<ol class=\"list\">\n{{#each}}\n    {{view view.listItem classNameBindings=\"isSelected\" }}\n{{/each}}\n\n{{#if view.newItem}}\n    {{view view.newItem}}\n{{/if}}\n</ol>\n");

Ember.TEMPLATES["modules/students"] = Ember.Handlebars.compile("{{#with students}}\n    {{view App.StudentsListView}}\n{{/with}}\n\n{{#with pendingInvitations}}\n    {{view App.InvitationsListView}}\n{{/with}}\n");

Ember.TEMPLATES["partials/_details-list"] = Ember.Handlebars.compile("<p>{{view.summaryText}}</p>\n\n{{#each application_essay in application_essays}}\n    {{render 'modules/essay/_app-item' application_essay}}\n{{/each}}\n");

Ember.TEMPLATES["partials/button"] = Ember.Handlebars.compile("{{view.text}}");

Ember.TEMPLATES["partials/tags"] = Ember.Handlebars.compile("<div id=\"tag-box\">\n<input id=\"tag-search\">\n<div id=\"tag-menu\"></div>\n</div>\n");

Ember.TEMPLATES["test/select"] = Ember.Handlebars.compile("{{autosuggest-tag data=this}}\n");