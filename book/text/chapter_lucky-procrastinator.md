---
title: "Lucky procrastinator"
style: chapter
conflict: 
decade: 
economy: 
temperature: 
---

{% include variables %}

Uh, really? Okay…
{:.leader-sentence}

You publish an editorial saying that we should bet on a technological breakthrough to magically fix our problems. It’s a very convincing piece!

World leaders lock ten of the smartest inventors on Earth in a room for a year and ask them to invent a technology to magically fix climate change.

They warn you there’s a one-in-six chance that they’ll find something.

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

Roll a die and see if we get lucky.
{:.choice-question}

- [If you roll 5 or less, ](chapter_no-magic-technology.html)
- [Wow, you rolled a 6? Okay! ](chapter_magic-technology-fix.html)
{:.choice-options}

{% else %}

<div data-js-var="js-rand-luck-high" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see if we get lucky.](chapter_magic-technology-fix.html)
{:.choice-options}

</div>

<div data-js-var="js-rand-luck-low" markdown="1" class="hidden">

- {:.random} [**Roll the dice** and see if we get lucky.](chapter_no-magic-technology.html)
{:.choice-options}

</div>

{% endif %}
