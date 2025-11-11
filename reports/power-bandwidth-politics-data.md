---
layout: page
title: Power–Bandwidth–Politics: Data Appendix
permalink: /reports/power-bandwidth-politics-data/
---

This page renders the core datasets inline for quick review. Sources are linked in each table. See the full essay for framing and analysis.

## Data snapshots (inline)

Frontier training compute (selected runs)

<table>
  <thead>
    <tr>
      <th>Year</th>
      <th>Model</th>
      <th>Training FLOPs (sci.)</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
  {% assign rows = site.data.pbp.demand_compute | sort: "year" %}
  {% for r in rows %}
    <tr>
      <td>{{ r.year }}</td>
      <td>{{ r.model }}</td>
      <td>{{ r.training_flops_scientific }}</td>
      <td><a href="{{ r.source_url }}">{{ r.source }}</a></td>
    </tr>
  {% endfor %}
  </tbody>
  <caption>Estimates compiled from Epoch AI.</caption>
  </table>

Global data‑centre electricity (TWh)

<table>
  <thead>
    <tr>
      <th>Region</th>
      <th>Year</th>
      <th>TWh</th>
      <th>Scenario</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
  {% for r in site.data.pbp.data_centre_power_projection %}
    {% if r.region == 'Global' and r.metric == 'consumption_twh' %}
    <tr>
      <td>{{ r.region }}</td>
      <td>{{ r.year }}</td>
      <td>{{ r.twh }}</td>
      <td>{{ r.scenario }}</td>
      <td><a href="{{ r.source_url }}">{{ r.source }}</a></td>
    </tr>
    {% endif %}
  {% endfor %}
  </tbody>
  <caption>IEA Energy &amp; AI outlook (base case).</caption>
  </table>

Advanced packaging (CoWoS) capacity – TSMC

<table>
  <thead>
    <tr>
      <th>Period</th>
      <th>Capacity</th>
      <th>Unit</th>
      <th>Note</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
  {% for r in site.data.pbp.packaging_capacity %}
    {% if r.company == 'TSMC' and r.technology == 'CoWoS' %}
    <tr>
      <td>{{ r.period }}</td>
      <td>{{ r.value }}</td>
      <td>{{ r.unit }}</td>
      <td>{{ r.note }}</td>
      <td><a href="{{ r.source_url }}">{{ r.source }}</a></td>
    </tr>
    {% endif %}
  {% endfor %}
  </tbody>
  <caption>TrendForce estimates and projections.</caption>
  </table>

US interconnection queue snapshot (GW)

<table>
  <thead>
    <tr>
      <th>As of</th>
      <th>Total (GW)</th>
      <th>Generation (GW)</th>
      <th>Storage (GW)</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
  {% for r in site.data.pbp.interconnection_queue_summary %}
    <tr>
      <td>{{ r.as_of }}</td>
      <td>{{ r.total_capacity_gw }}</td>
      <td>{{ r.generation_gw }}</td>
      <td>{{ r.storage_gw }}</td>
      <td><a href="{{ r.source_url }}">{{ r.source }}</a></td>
    </tr>
  {% endfor %}
  </tbody>
  <caption>LBNL “Queued Up” report and queue updates.</caption>
  </table>

Nuclear PPAs (selected)

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Buyer</th>
      <th>Plant</th>
      <th>Capacity (MW)</th>
      <th>Term (yrs)</th>
      <th>Location</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
  {% for r in site.data.pbp.power_deals %}
    <tr>
      <td>{{ r.date }}</td>
      <td>{{ r.buyer }}</td>
      <td>{{ r.plant_or_source }}</td>
      <td>{{ r.capacity_mw }}</td>
      <td>{{ r.term_years }}</td>
      <td>{{ r.location }}</td>
      <td><a href="{{ r.source_url }}">{{ r.source }}</a></td>
    </tr>
  {% endfor %}
  </tbody>
  <caption>Announced firm power deals relevant to compute siting.</caption>
  </table>

---

Raw CSVs live under <code>/assets/data/</code>, and the full workbook is at <code>/assets/sheets/power-bandwidth-politics.xlsx</code>.

