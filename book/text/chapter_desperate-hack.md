---
title: "Desperate Hack"
style: chapter
conflict: 
decade: 
economy: 
temperature: 3
---

{% include variables %}

You publish an editorial encouraging *anyone* to try a last-minute climate hack.
{:.leader-sentence}

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

Roll a die!
{:.choice-question}

- [If you roll a 1, ](chapter_geo-engineering-fail.html)
- [If you roll a 2 or 3, ](chapter_rogue-climate-hackers.html)
- [If you roll a 4 or higher, ](chapter_small-scale-wars.html)
{:.choice-options}

{% else %}

<div data-js-var="js-rand-geoengineering1-low" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_geo-engineering-fail.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-geoengineering1-med" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_rogue-climate-hackers.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-geoengineering1-high" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see what happens.](chapter_small-scale-wars.html)
{:.choice-options}

</div>

{% endif %}
