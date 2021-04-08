---
title: "Desperation"
style: chapter
conflict: 
decade: 
economy: 
temperature: 3
---

Feeling increasingly hopeless, various groups of climate rebels get together and start discussing cheap ways to hack the climate.
{:.leader-sentence}

There are risks.

Should we try a last-ditch geo-engineering solution?
{:.choice-question}

- (link: “Why not? We have to try something.”)[(set: $geoengineering to (random: 1,6))(if: $geoengineering \<= 1)[(goto:“Geo-engineering FAIL”)(goto:“Rogue climate hackers”)](about:blank)[(goto:“Small-scale wars”)]]
- [It’s too dangerous.](chapter_ignored.html)
{:.choice-options}
