---
title: "Carbon capture?"
style: chapter
conflict: 
decade: 
economy: 
temperature: 
---

(if: $carboncapture is 1)[Phew, okay, we did decide to invest in a planetary clean-up project back in the 2050s. Luckily that means that there are fewer greenhouse gases in the atmosphere. The planet will warm a bit, but the magnificent Council has enough time to fix the space mirrors before anything too bad happens. Thank you, Council! (set: $temp to 2)

[[Congratulations, you made it to 2080!->Welcome to 2080 (Designer Planet)]]]

(else:)[Oh, whoops, we did not invest in a planetary clean-up project. It just didn’t seem necessary! (set: $temp to 5)

Without the space mirrors keeping the planet cool, things heat up FAST. The world experiences the hottest year ever. Most major coastal cities are flooded. People die of heatstroke. Wild animals from warm parts of the world have to be ushered into temporary air-conditioned enclosures to keep them alive.

Most of the remaining insects die out, including all bees. The council scrambles to figure out a solution before everyone dies of hunger.

**Will our magnificent Council figure something out in time?**
{:.choice-question}

(link: “Let’s sure hope so.”)[(set: $insects to (random: 1,6))(if: $insects \<= 2)[(goto:“Fail to invent insect drones”)](about:blank)[(goto:“Invent insect drones”)]]]
