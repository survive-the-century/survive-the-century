---
title: "Martians return"
style: chapter
conflict: 
decade: 2080
economy: 
temperature: 
---

{% include variables %}


Uh-oh. 
{:.leader-sentence}

Remember all the billionaires who left in the 2060s and went to live on a Mars colony?

They just invaded Earth. They say they want their planet back.

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

Oh boy. Do you have that KUMBAYA badge?
{:.choice-question}

- [Shoot! No, we disbanded all of the militaries, remember!?](chapter_billionaire-ecotopia-takeover.html)
- [Yes! We kept some militaries in place, so we can fight them off. Phew.](part-page_2090-ecotopia.html)
{:.choice-options}

{% else %}

Oh boy. Do we still have some kind of global military we could call up?
{:.choice-question}

<div data-js-var="css-var-military-no" markdown="1" class="hidden">

- [Shoot! No, we disbanded all of the militaries, remember!?](chapter_billionaire-ecotopia-takeover.html)
{:.choice-options}

</div>

<div data-js-var="css-var-military-yes" markdown="1" class="hidden">

- [Yes! We kept some militaries in place, so we can fight them off. Phew.](part-page_2090-ecotopia.html)
{:.choice-options}

</div>

{% endif %}
