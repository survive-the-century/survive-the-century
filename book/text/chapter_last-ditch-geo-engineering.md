---
title: "Last-ditch geo-engineering"
style: chapter
conflict: 
decade: 
economy: 
temperature: 2.25
---

The effects of climate change are getting more and more severe. 
{:.leader-sentence}

Some experts argue that it’s time to deploy some form of ambitious geo-engineering project to buy ourselves time to get the climate back under control.

But geo-engineering technology is still largely untested, and there’s a lot of uncertainty about whether it will work, or how it would be managed. Something could go wrong.

We could try geo-engineering now, or spend a few more years talking about it first, trying to reach international consensus about how we should go about it.

**Should we try a last-ditch geo-engineering solution?**
{:.choice-question} 

(set: $stalling to 0) (link-repeat: “Let’s keep talking about it for a few more years.”)[(if: $stalling >= 2)[(goto:"Stalling")](else:)[(set:$stalling to it + 1)]]

(link: “Let’s give it a go.”)[(set: $geoengineering to (random: 1,6))(if: $geoengineering \<= 1)[(goto:“Geo-engineering FAIL”)(goto:“Billionaire geo-engineering”)(goto:“Unilateral geo-engineering”)](about:blank)[(goto:“Surprising success geo-engineering”)]]
 
Solar radiation management or modification (SRM) is an untested group of techniques and technologies that aim to reflect sunlight away from the earth. These include ideas like injecting sulphur aerosols into the stratosphere, brightening the clouds above the ocean, or even deploying space mirrors that bounce sunlight away from the earth. SRM would not undo the damage we’ve done to our planet: instead, it would simply slow warming without reducing the greenhouse gas emissions that drive climate change. SRM is highly controversial, with many people arguing that further tampering with our climate system is too risky.
{:.infobox}
