---
title: 
style: 
conflict: 
decade: 
economy: 
temperature: 
---

## Desperation

Feeling increasingly hopeless, various groups of climate rebels get together and start discussing cheap ways to hack the climate.

There are risks.

**Should we try a last-ditch geo-engineering solution?**
{:.choice-question}

(link: “Why not? We have to try something.”)[(set: $geoengineering to (random: 1,6))(if: $geoengineering \<= 1)[(goto:“Geo-engineering FAIL”)(goto:“Rogue climate hackers”)](about:blank)[(goto:“Small-scale wars”)]]

[[It’s too dangerous.->Ignored]]

(set: $temp to 3)
