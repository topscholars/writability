Ember.TEMPLATES["application"] = Ember.Handlebars.compile("  <div>\n      {{outlet}}\n        </div>}}\n");

Ember.TEMPLATES["essays"] = Ember.Handlebars.compile("<section id=\"todoapp\">\n  ... additional lines truncated for brevity ...\n</section>\n\n<footer id=\"info\">\n  <p>Double-click to edit a todo</p>\n</footer>\n\n<ul id=\"todo-list\">\n  {{#each}}\n    <li>\n      <input type=\"checkbox\" class=\"toggle\">\n      {{id}}\n      asd {{word_count}} plp\n      asd {{wordCount}} plp\n    </li>\n  {{/each}}\n</ul>\n");