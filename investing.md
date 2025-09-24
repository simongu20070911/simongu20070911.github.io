---
layout: page
title: Investing
permalink: /investing/
---

## Approach

I track how structural technology shifts flow through cash flows, balance sheets, and valuations. The goal is to pair narrative with layered numbers—build the full stack model, publish the assumptions, and show the sensitivities so you can remix the analysis yourself.

## Featured Scenario: Abundant Intelligence

- 52 GW/year of new AI capacity → 52 million accelerators and **$1.63 T** stack capex
- **$1.3 T** of annual AI service revenue split across the hyperscalers and their ecosystems
- NVIDIA and AMD add **$154 B** and **$36 B** of steady-state net income without touching the capex line
- Microsoft, Apple, Alphabet, Amazon, and Meta collectively shoulder **$1.01 T** of annual infrastructure spend to keep the grid humming

![Stack economics]({{ "/assets/abundant-intelligence/market_cap_projection.png" | relative_url }})

## Data Room

- [Scenario summary CSV]({{ "/assets/abundant-intelligence/scenario_summary.csv" | relative_url }}) — headline valuations, steady-state earnings, and applied multiples
- [Capex vs. incremental cash]({{ "/assets/abundant-intelligence/capex_vs_incremental_cash.csv" | relative_url }}) — hyperscaler capital intensity vs. earnings power
- [Incremental cash-flow ramp]({{ "/assets/abundant-intelligence/incremental_cashflows.csv" | relative_url }}) — year-by-year build with discounting inputs
- [NVIDIA sensitivity grids]({{ "/assets/abundant-intelligence/nvda_sensitivity_heatmap.png" | relative_url }}) — valuation swing across share, ASP, and margin levers
- [Full scenario results]({{ "/assets/abundant-intelligence/scenario_results.txt" | relative_url }}) — narrative-ready output straight from the engine
- [Python model]({{ "/assets/abundant-intelligence/market_cap_model.py" | relative_url }}) — reproducible code

## Investing Research Archive

{% assign investing_posts = site.categories.investing | sort: "date" | reverse %}
{% if investing_posts and investing_posts.size > 0 %}
<ul>
  {% for post in investing_posts %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <span style="color:#666; font-size:0.9em;">({{ post.date | date: "%b %d, %Y" }})</span> — {{ post.summary | default: post.excerpt | strip_html | truncate: 140 }}</li>
  {% endfor %}
</ul>
{% else %}
<p>No investing posts yet—stay tuned.</p>
{% endif %}

If you want deeper dives—utilities, robotics, or the financing side of this build—send a note and I’ll prioritise that modelling next.
