---
layout: post
title:  "Abundant Intelligence: Who Wins a 52 GW per Year AI Build-Out"
date:   2025-09-24 09:00:00 +0000
categories: analysis investing ai
summary: "Sam Altman’s 1 GW-per-week ambition maps to $1.6T of annual capex. Here’s how that spend flows through GPUs, cloud platforms, memory, power, and Tesla in an aggressively scaled scenario."
redirect_from:
  - /2025/09/24/abundant-intelligence-market-cap-scenario.html
---

## Why this scenario matters

Sam Altman floated a factory network that can drop a gigawatt of AI compute every week. Scale that to a full year and you are staring at **52 GW of fresh capacity**—roughly **52 million 700 W accelerators** and a stack that has to be financed, powered, cooled, and monetised. I rebuilt my market-cap engine around that premise to see who captures the economics and who ends up holding the bill. (Original essay: [“Abundant Intelligence” by Sam Altman](https://moores.samaltman.com/abundant-intelligence).)

The headline: a fully funded “abundant intelligence” build-out pushes **$1.63 trillion of capex** into the ecosystem annually and spins off **$1.3 trillion of AI service revenue**. The winners are not just the obvious GPU vendors; hyperscalers, memory suppliers, and energy producers all get a rerating, while balance-sheet stress shifts to whichever platforms choose to own the infrastructure.

## Scenario structure at a glance

- **Hardware cadence:** 52 million accelerators a year, 2.8× stack multiplier → $1.63 T all-in capex.
- **Share of the GPU pie:** NVIDIA 65%, AMD 25%, custom silicon 10%; ASPs of $12k / $10k / $9k with 38% / 28% net margins.
- **Memory and power:** Eight HBM stacks per accelerator ($5.5k each) with SK Hynix and Micron sharing 90% of supply; 52 GW of incremental generation split between NextEra (40%) and Constellation (30%).
- **Service monetisation:** 80% of stack spend shows up as AI services. Microsoft, Apple, Alphabet, Amazon, Meta, Oracle, and Tesla robotics anchor 80% of the pool; the rest goes to AWS customers, start-ups, and other ecosystems.
- **Valuation lens:** Nine-year ramp (2026–2034), 10% discount rate, 3% terminal growth, and rerated multiples that reflect scaled AI franchises (NVDA 32×, MSFT 36×, etc.).

![Scenario cash and capex flow]({{ "/assets/abundant-intelligence/market_cap_projection.png" | relative_url }})

## Valuations: who adds the next trillions

| Company | Scenario Market Cap (TUSD) | Baseline (TUSD) | Incremental Steady-State NI (BUSD) | Capex Burden (BUSD/yr) |
| --- | ---: | ---: | ---: | ---: |
| Microsoft | **6.46** | 3.82 | 91.3 | 326.1 |
| NVIDIA | **6.34** | 4.47 | 154.1 | 0.0 |
| Apple | **5.43** | 3.78 | 62.6 | 244.6 |
| Alphabet | **4.44** | 2.20 | 58.7 | 244.6 |
| Amazon | **3.99** | 2.35 | 50.1 | 195.7 |
| Tesla | **3.20** | 1.42 | 34.2 | 0.0 |
| Meta | **2.69** | 1.90 | 45.7 | 163.1 |
| AMD | **1.33** | 0.26 | 36.4 | 0.0 |
| SK Hynix | **1.10** | 0.18 | 37.9 | 0.0 |
| Micron | **0.70** | 0.19 | 17.2 | 0.0 |
| Oracle | **0.90** | 0.93 | 19.6 | 81.5 |
| ASML | **0.44** | 0.38 | 4.2 | 0.0 |
| NextEra | **0.20** | 0.15 | 1.9 | 0.0 |
| Constellation | **0.14** | 0.11 | 1.8 | 0.0 |

Three themes jump off the page:

1. **Capital-light beneficiaries dominate the upside.** NVIDIA, AMD, and the memory players collect outsized incremental net income without writing the cheques for plants or data centres.
2. **Hyperscalers must decide how much balance sheet to deploy.** Microsoft’s share of stack capex alone is modelled at $326 B/year. Apple, Alphabet, Amazon, and Meta each absorb $160–245 B.
3. **Tesla’s upside is real—but levered to optionality.** Robotics, FSD subscriptions, and storage attach rates drive the rerating. Under a downside mix (12 M subs at $80, 20% storage attach, 25% robotics margin) the valuation compresses to $2.2 T.

![NVDA vs AMD uplift under the scenario]({{ "/assets/abundant-intelligence/nvda_vs_amd_market_caps.png" | relative_url }})

The relative uplift is lopsided: AMD’s cap jumps ~9× versus ~2.8× for NVIDIA. The mechanics—multi-sourced accelerator share, easing supply bottlenecks, and buyer-imposed diversification—are unpacked in [NVIDIA vs. AMD: Seven Powers, One Market Supercycle]({% post_url 2025-09-24-nvda-vs-amd-moat-analysis %}). That follow-on piece also includes sensitivity curves and a full moat comparison.

![Incremental earnings ramp]({{ "/assets/abundant-intelligence/incremental_net_income_ramp.png" | relative_url }})

## Capex versus cash generation

The stack spins out roughly **$1 trillion of annual service gross profit**, but hyperscalers collectively shoulder **$1.01 trillion of capex** to keep the capacity online. Incremental net income-to-capex ratios cluster between 0.2× and 0.3×, implying the build has to be financed with a combination of debt, partnerships, or customer prepayments. Capital-light names sidestep that question entirely.

The model assumes 80% utilisation and $0.065/kWh power purchase agreements. Any spike in power pricing or utilisation shortfall shifts the economics from attractive to strained surprisingly fast.

## Stress tests: NVIDIA and Tesla as swing factors

![NVIDIA valuation sensitivity]({{ "/assets/abundant-intelligence/nvda_sensitivity_heatmap.png" | relative_url }})

- **NVIDIA sensitivity:** Valuation ranges from $4.75 T to $8.24 T across ±20% ASP moves and 55–75% share. Margins and pricing leverage are worth trillions.
- **Tesla downside:** Cutting FSD subscriptions, storage attach, and robotics margins roughly in half drops permanent valuation to **$1.69 T** with incremental NI around **$16–18 B**.
- **Service “white space”:** Even after the big platforms take their cut, >20% of the AI service pool remains unassigned. That is room for AWS customers, Meta’s WhatsApp ecosystem, and independent AI providers to build durable businesses.

## What to watch next

- **Financing mechanics:** Which hyperscalers push capex to partners versus keeping control of the stack? Expect creative leasing, structured finance, and customer co-investment if rates stay elevated.
- **Regulatory drag:** Anti-trust, export controls, and power-market permitting could slow the ramp or squeeze margins. I model a clean run-rate; reality will introduce friction.
- **Power economics:** 52 GW/year is a colossal demand shock. If PPA pricing moves above $0.065/kWh or utilisation drops from 90%, the ROI math changes quickly.
- **Second-order winners:** Utilities, EPC contractors, copper miners, and cooling specialists are outside this write-up but deserve a line on the tracker.

The “abundant intelligence” idea is still aspirational, but the math shows how quickly trillions of market cap could reprice if the build actually happens. The companies that keep optionality on capital deployment, margins, and regulatory goodwill will control the narrative.

*Source files:* [Scenario scripts and data](https://github.com/simongu20070911/simongu20070911.github.io/tree/master/assets/abundant-intelligence) will be published alongside this post as I continue refining the model.
