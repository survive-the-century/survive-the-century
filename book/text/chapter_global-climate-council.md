---
title: "Global climate council"
style: chapter
conflict: 
decade: 2050
economy: 
temperature: 2.1
---

{% include variables %}


We successfully launch a fleet of space mirrors that reflects some sunlight away from the planet, reducing warming.
{:.leader-sentence}

In a historic meeting, we establish a new global climate council that oversees the project, and begin to deploy it. All council members must be under the age of 20, because they have the most stake in the future of the planet.

The council is warned that if the space-mirror project ever fails, there might be terrible consequences. The world can also invest in a backup plan, building machines that suck carbon out of the atmosphere, but it will be expensive. The cost will mean a five per cent reduction of everyone’s UBI (universal basic income), which will be unpopular!

Should we also invest in the planetary clean-up project?
{:.choice-question}

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

- [Nah, we trust the space mirrors!](part-page_2060-designer-planet.html)
- Yes, let’s make sure there’s a plan B. [Award yourself the PLAN B badge](endmatter_shiny-badges.html){:.show-page-number target="_blank"}, [then:](part-page_2060-designer-planet.html)
{:.choice-options}

{% else %}

- [Nah, we trust the space mirrors!](part-page_2060-designer-planet.html){:data-js-var="js-var-carboncapture-0"}
- [Yes, let’s make sure there’s a plan B.](part-page_2060-designer-planet.html){:data-js-var="js-var-carboncapture-1"}
{:.choice-options}

{% endif %}
