---
title: "Well-researched geo-engineering attempt"
style: chapter
conflict: 
decade: 
economy: 
temperature: 3
---

{% include variables %}

You publish an editorial arguing that we need to try a geo-engineering solution. But what will that solution look like?
{:.leader-sentence}

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

Roll a die!
{:.choice-question}

- [If you roll a 1, ](chapter_geo-engineering-fail.html)
- [If you roll a 2 or higher, ](chapter_global-climate-council.html)
{:.choice-options}

{% else %}

<div data-js-var="js-rand-geoengineering3-low" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_geo-engineering-fail.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-geoengineering3-high" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_global-climate-council.html)
{:.choice-options}

</div>

{% endif %}
