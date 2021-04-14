---
title: "Carbon capture?"
style: chapter
conflict: 
decade: 
economy: 
temperature: 
---

{% include variables %}

<div class="js-var-carboncapture-1" markdown="1">

Phew, okay, we did decide to invest in a planetary clean-up project back in the 2050s. 
{:.leader-sentence}

Luckily that means that there are fewer greenhouse gases in the atmosphere. The planet will warm a bit, but the magnificent Council has enough time to fix the space mirrors before anything too bad happens. Thank you, Council! 

- [Congratulations, you made it to 2080!](part-page_2080.html){:js-next-dest="newspaper_welcome-to-2080-designer-planet.html"}
{:.choice-options}

(set: $temp to 2)

</div>

<div class="js-var-carboncapture-0" markdown="1">

Oh, whoops, we did not invest in a planetary clean-up project. 
{:.leader-sentence}

It just didn’t seem necessary! 

Without the space mirrors keeping the planet cool, things heat up FAST. The world experiences the hottest year ever. Most major coastal cities are flooded. People die of heatstroke. Wild animals from warm parts of the world have to be ushered into temporary air-conditioned enclosures to keep them alive.

Most of the remaining insects die out, including all bees. The council scrambles to figure out a solution before everyone dies of hunger.

Will our magnificent Council figure something out in time?
{:.choice-question}

(set: $insects to (random: 1,6))

<div class="js-var-insect-fail" markdown="1">

(if: $insects <= 2)

- [Let's sure hope so](chapter_fail-to-invent-insect-drones.html)
{:.choice-options}

</div>

<div class="js-var-insect-success" markdown="1">

</div>

- [Let's sure hope so](chapter_invent-insect-drones.html)
{:.choice-options}

(set: $temp to 5)

</div>
