---
title: "Miscalculation"
style: chapter
conflict: 
decade: 
economy: down
temperature: 
---

{% include variables %}

Uh-oh.
{:.leader-sentence}

You get a frantic phone call in the middle of the night: a rogue group of democracy activists blew up the space mirror control centre, bringing it offline.

Your lead climate reporter tells you, in a voice choked with fear, that a sudden increase in the temperature could be catastrophic. Our only hope is that back in the 2050s when we launched the space mirrors, we continued to clean up all the greenhouse gases in the atmosphere too.

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

Oh heck, did we do that?
{:.choice-question}

- [If you have the PLAN B badge,](chapter_carbon-capture-0.html)
- [If you don't,](chapter_carbon-capture-1.html)
{:.choice-options}

{% else %}

<div data-js-var="css-var-carboncapture-0" markdown="1" class="hidden">

- [Oh heck, did we do that?](chapter_carbon-capture-0.html)
{:.choice-options}

</div>

<div data-js-var="css-var-carboncapture-1" markdown="1" class="hidden">

- [Oh heck, did we do that?](chapter_carbon-capture-1.html)
{:.choice-options}

</div>

{% endif %}
