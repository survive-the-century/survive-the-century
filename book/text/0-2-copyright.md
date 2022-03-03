---
title: Copyright
style: copyright-page

# The Liquid tags here fetch metadata 
# from this book's YML file in _data
---

{% include variables %}
{% include metadata %}

# {{ page.title }}
{:.non-printing}

*{{ title }}*\\
Text © the contributors

{% include identifiers scheme="ISBN" %}

{{ rights }}
