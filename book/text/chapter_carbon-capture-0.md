---
title: "Carbon capture?"
style: chapter
conflict: 
decade: 2070
economy: down
temperature: 4
---

{% include variables %}

Oh, whoops, we did not invest in a planetary clean-up project. 
{:.leader-sentence}

It just didn’t seem necessary! 

Without the space mirrors keeping the planet cool, [things heat up FAST](#infobox). The world experiences the hottest year ever. Most major coastal cities are flooded. People die of heatstroke. Wild animals from warm parts of the world have to be ushered into temporary air-conditioned enclosures to keep them alive.

Most of the remaining insects die out, including all bees. The Council scrambles to figure out a solution before everyone dies of hunger.

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

[Award yourself the OH, WERE THESE IMPORTANT badge](endmatter_shiny-badges.html){:.show-page-number target="_blank"}!

{% endif %}

Will our magnificent Council figure something out in time? Let's sure hope so.
{:.choice-question}

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

Roll a die!

- [If you roll 2 or less,](chapter_fail-to-invent-insect-drones.html)
- [If you roll higher than 2,](chapter_invent-insect-drones.html)
{:.choice-options}

{% else %}

<div data-js-var="js-rand-insect-failure" markdown="1" class="hidden">

- {:.random} [Let's sure hope so.](chapter_fail-to-invent-insect-drones.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-insect-success" markdown="1" class="hidden">

- {:.random} [Let's sure hope so.](chapter_invent-insect-drones.html){:data-js-var="js-var-temperature-2"}
{:.choice-options}

</div>

{% endif %}

> One of the potential risks of blocking some of the sun’s rays to offset global warming is that if we stopped, the temperature could rise very quickly. This would happen if geoengineering was deployed without society also reducing greenhouse gas emissions at the same time. Suddenly stopping geoengineering would cause temperatures to rebound fast. Scientists call this risk "termination shock" and it would be catastrophic for ecosystems globally.
{:.infobox}
