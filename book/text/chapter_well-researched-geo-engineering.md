---
title: "Well-researched geo-engineering"
style: chapter
conflict: 
decade: 
economy: 
temperature: 3
---

<h1>{{ page.title }}</h1>

{% include variables %}

All this investment in research starts paying off. 
{:.leader-sentence}

We’ve developed a technology that we think will allow us to engineer the climate and solve global warming once and for all.

There is some risk that something will go wrong. We could spend a few more years doing research to improve the chances that it won’t, but we also can’t afford to wait much longer.

Should we try a geo-engineering solution now, or do more research?
{:.choice-question}

- [Let’s do a little more research first.](chapter_stalling.html){:js-var="js-var-stalling-1"}
- [Let’s give it a go](geoengineering-1-10-placeholder){:js-var="js-var-geoengineering"}

(set: $stalling to 0) (link-repeat: “”)[(if: $stalling \>= 1)[(goto:"Stalling")](else:)[(set:$stalling to it + 1)]]

(link: “”)[(set: $geoengineering to (random: 1,10))(if: $geoengineering \<= 1)[(goto:“Geo-engineering FAIL”)](else)[(goto:“Global climate council”)]]

Solar radiation management or modification (SRM) is an untested group of techniques and technologies that aim to reflect sunlight away from the earth. These include ideas like injecting sulphur aerosols into the stratosphere, brightening the clouds above the ocean, or even deploying space mirrors that bounce sunlight away from the earth. SRM would not undo the damage we’ve done to our planet: instead, it would simply slow warming without reducing the greenhouse gas emissions that drive climate change. SRM is highly controversial, with many people arguing that further tampering with our climate system is too risky.
{:.infobox}
