---
layout: page
title: Investing
permalink: /investing/
---

## Philosophy

I map structural technology shifts into cash flows, capital intensity, and market-cap impact. Each study ships with open files so you can replay the assumptions and bend the sensitivities.

## Featured Research

**Abundant Intelligence: Who Wins a 52 GW per Year AI Build-Out**  
Sam Altman’s 1 GW-per-week build implies 52 million accelerators annually, **$1.63 T** of stack capex, and **$1.3 T** in AI service revenue. The post unpacks who captures the economics across GPUs, hyperscalers, memory, and energy.

- [Read the scenario →]({% post_url 2025-09-24-abundant-intelligence-market-cap-scenario %})
- [Download the model]({{ "/assets/abundant-intelligence/market_cap_model.py" | relative_url }})
- [Grab the scenario summary CSV]({{ "/assets/abundant-intelligence/scenario_summary.csv" | relative_url }})

![Stack economics]({{ "/assets/abundant-intelligence/market_cap_projection.png" | relative_url }})

## Latest Investing Notes

{% assign investing_posts = site.categories.investing | sort: "date" | reverse %}
{% if investing_posts and investing_posts.size > 0 %}
<ul>
  {% for post in investing_posts limit:6 %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span style="color:#666; font-size:0.85em;">{{ post.date | date: "%b %d, %Y" }}</span><br>
    <span style="color:#444; font-size:0.9em;">{{ post.summary | default: post.excerpt | strip_html | truncate: 140 }}</span>
  </li>
  {% endfor %}
</ul>
{% else %}
<p>No investing posts yet—stay tuned.</p>
{% endif %}

[See the full archive →]({{ "/categories/#investing" | relative_url }})

## Data Room

- [Scenario summary CSV]({{ "/assets/abundant-intelligence/scenario_summary.csv" | relative_url }})
- [Capex vs. incremental cash]({{ "/assets/abundant-intelligence/capex_vs_incremental_cash.csv" | relative_url }})
- [Incremental cash-flow ramp]({{ "/assets/abundant-intelligence/incremental_cashflows.csv" | relative_url }})
- [NVIDIA sensitivity heatmap]({{ "/assets/abundant-intelligence/nvda_sensitivity_heatmap.png" | relative_url }})
- [Full scenario results]({{ "/assets/abundant-intelligence/scenario_results.txt" | relative_url }})
- [Python model]({{ "/assets/abundant-intelligence/market_cap_model.py" | relative_url }})

If you want deeper dives—utilities, robotics, or financing structures—drop a note and I’ll prioritise that modelling next.
