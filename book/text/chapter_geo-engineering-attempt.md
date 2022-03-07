---
title: "Geo-engineering attempt"
style: chapter
conflict: 
decade: 
economy: 
temperature: 2.25
---

{% include variables %}

You publish an editorial arguing that we need to try a geo-engineering solution. But what will that solution look like?
{:.leader-sentence}

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

Roll a die!
{:.choice-quesion}

- [If you roll a 1, ](chapter_geo-engineering-fail.html)
- [If you roll a 2 or 3, ](chapter_billionaire-geo-engineering.html)
- [If you roll a 4, ](chapter_unilateral-geo-engineering.html)
- [If you roll a 5 or 6, ](chapter_surprising-success-geo-engineering.html)
{:.choice-options}

{% else %}

<div data-js-var="js-rand-geoengineering2-low" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_geo-engineering-fail.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-geoengineering2-med" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_billionaire-geo-engineering.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-geoengineering2-medplus" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_unilateral-geo-engineering.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-geoengineering2-high" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_surprising-success-geo-engineering.html)
{:.choice-options}

</div>

{% endif %}
