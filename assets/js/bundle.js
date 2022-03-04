---
# A bundle of scripts.
# Jekyll will assemble and populate these.
layout: null
---

{% include metadata %}

{% include_relative polyfills.js %}
{% include_relative utilities.js %}
{% include_relative settings.js %}
{% include_relative locales.js %}
{% include_relative mark-parents.js %}


{% if site.output == "web" or site.output == "app" %}

    {% comment %} This order is important. {% endcomment %}
    {% include_relative setup.js %}
    {% include_relative vendor/mark.min.js %}
    
    {% include_relative copy-to-clipboard.js %}
    {% include_relative history.js %}
    {% include_relative variables.js %}
    {% include_relative choices.js %}
    {% include_relative random.js %}
    {% include_relative glow.js %}
    {% include_relative buttons.js %}

    {% if site.data.settings.web.svg.inject == true %}
        {% include_relative vendor/svg-inject.min.js %}
        {% include_relative svg-management.js %}
    {% endif %}

    {% comment %} Load after SVG management {% endcomment %}
    {% include_relative lazyload.js %}

{% endif %}

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}
    {% include_relative page-numbers.js %}
    {% include_relative print-sections.js %}
{% endif %}
