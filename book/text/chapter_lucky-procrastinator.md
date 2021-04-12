---
title: "Lucky procrastinator"
style: chapter
conflict: 
decade: 
economy: 
temperature: 
---

<h1>{{ page.title }}</h1>

{% include variables %}
Uh, really? Okay…
{:.leader-sentence}

You publish an editorial saying that we should bet on a technological breakthrough to magically fix our problems. It’s a very convincing piece!

World leaders lock ten of the smartest inventors on earth in a room for a year and ask them to invent a technology to magically fix climate change.

They warn you there’s a one in ten chance that they’ll find something.

(link: “Roll the dice and see if we get lucky.”)[(set: $luck to (random: 1,10))(if: $luck is 1)[(goto: “Magic technology fix”)](about:blank)[(goto: “No magic technology”)]]
