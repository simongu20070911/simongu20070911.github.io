---
layout: post
title: "The Power–Bandwidth–Politics Condition: Why the Compute Race Is Conditionally Unbounded"
date: 2025-11-11 10:00:00 +0000
categories: compute policy systems
excerpt: "A rigorous synthesis: demand looks unbounded when scaling works; supply is gated in the 2025–2035 window by power, bandwidth, and political economy."
published: false
---

The race for more computing is not literally unlimited; it is conditionally unbounded. On the demand side, revealed returns to additional compute at the frontier remain high, so actors behave as if demand were unbounded. On the supply side, growth over the next decade is paced by three chokepoints: power (electricity supply and heat rejection), bandwidth (memory throughput and advanced packaging), and political economy (capital intensity, supply chains, and export controls). By “more computing,” I mean effective compute for frontier workloads—floating‑point operations (FLOPs) actually delivered to training and serving state‑of‑the‑art artificial intelligence (AI) systems after algorithmic and systems efficiencies. By “almost unlimited,” I mean capable of many further doublings without meeting an intrinsic ceiling this decade. On these definitions, the claim holds only if the system clears the three chokepoints; otherwise growth bends into an S‑curve well before 2035. Empirically, demand has behaved as if unbounded; supply is the question [1].

## Framing the claim

The intent and demand for compute are “almost” unlimited; the medium‑term limits are watts, bandwidth, and politics, not physics. Absolute physical limits exist—for example Landauer’s bound on energy per irreversible bit erased—and experiments have verified the principle. But those limits are distant relative to today’s operational bottlenecks in grids, memory stacks, and geopolitics [2].

## Why demand looks unbounded when scaling works

At the frontier, actors scale because scaling keeps paying. Training compute for notable models grew roughly four to five times per year from 2010 into mid‑2024; an earlier OpenAI analysis found an even faster 3.4‑month doubling for the most compute‑intensive runs in 2012–2018 [11]. Measured training algorithmic efficiency—compute needed to hit a fixed capability—roughly doubled about every sixteen months in 2012–2019. The Chinchilla result formalized compute‑optimal training—smaller dense models trained on more tokens—lowering cost for a given quality and redirecting savings to bigger tasks [12]. This is a classic rebound effect (Jevons paradox) [18]: efficiency lowers unit cost and expands total consumption. When capability scales with compute and algorithms become more frugal, the incentive is to buy more compute, not less. These are the revealed preferences of labs and hyperscalers [1].

There is also a feedback loop between compute and discovery. More compute enables models that automate parts of research—hypothesis generation, theorem search, code optimization—and that, in turn, creates more valuable tasks worth computing. Think of an “Alpha‑Evolve” style research engine: given a scientific objective, it proposes hypotheses, spins up thousands of in‑silico experiments in parallel, and triages what to test physically. The first‑order effect is to multiply the surface area of tractable problems; the second‑order effect is to raise the opportunity cost of not running more compute. This dynamic helps explain why training‑run compute kept rising super‑exponentially: when scale reliably moves the frontier, the equilibrium is to scale until something else binds [1].

Finally, demand is now anchored not only by episodic training but also by serving. Inference—the process of running trained models to answer queries—has become a durable base load spread across billions of daily interactions, with training adding peaks. Capital markets have learned to finance long‑lived compute and energy assets against multi‑year AI demand, flattening the cost of capital for hyperscalers and their energy partners.

Strategically, states treat compute as a national capability. The U.S. CHIPS and Science Act mobilizes tens of billions of dollars for domestic capacity; the European Union’s Chips Act pursues similar aims. In parallel, export controls and compute‑reporting rules now reference training thresholds on the order of 10^26 FLOPs, explicitly measuring and governing the input itself. These policies channel demand toward trusted supply chains rather than satiating it [16, 17].

## What actually binds now

Power, bandwidth, and political economy are the proximate constraints in the 2025–2035 window. Each is scalable in principle, but each carries friction that determines the calendar.

Power. Base‑case energy analyses project that global data‑centre electricity use could roughly double by 2030, to on the order of about 945 TWh, with AI the key driver. That number is not a law of nature; it is contingent infrastructure: siting, interconnection, long‑term contracts, and cooling. In practice, hyperscalers have begun signing large nuclear power‑purchase agreements (PPAs; long‑dated contracts for electricity) to secure firm, low‑carbon power—for example Microsoft’s twenty‑year deal enabling the restart of Three Mile Island Unit 1, and Amazon Web Services’ multi‑gigawatt deal associated with the Susquehanna nuclear plant. These moves signal a migration of the “compute race” from transistors to energy procurement and grid integration [3, 8].

Bandwidth. Today’s frontier accelerators are memory‑ and packaging‑bound as much as they are transistor‑bound. High Bandwidth Memory (HBM; stacked dynamic random‑access memory, DRAM, providing very high throughput) and advanced 2.5D/3D packaging—such as Chip‑on‑Wafer‑on‑Substrate (CoWoS) and hybrid bonding—are the scaling fulcrum and a long pole. In 2024, SK hynix reported HBM sold out for 2024 and almost sold out for 2025; analysts repeatedly flagged CoWoS capacity as an enabler and bottleneck for AI chips, with expansions racing to catch up. These constraints cap delivered floating‑point operations per calendar time regardless of how many wafers are fabbed. Vendors are guiding sharp increases—for example, TSMC toward roughly 75,000 CoWoS wafers in 2025, about double 2024 output [4, 9, 13].

Tools and export policy. Lithography continues to advance: ASML shipped the first High‑NA (high numerical aperture) Extreme Ultraviolet (EUV) modules to Intel in late 2023, with early high‑volume manufacturing (HVM) centered on 2026–2027. But each step is slower, costlier, and more capital‑intensive than the last, and adoption choices by foundries remain economically contingent. In parallel, export‑control regimes modulate where advanced tools and chips can flow. Since 2023, the U.S. Bureau of Industry and Security (BIS) has iterated its advanced‑computing rules; the Dutch government has updated ASML licensing requirements (including for immersion Deep UV). These measures add an allocation layer atop pure economics [5, 10].

Institutions and interconnection. Even when power plants exist, interconnection queues and transmission constraints delay energizing large loads. The U.S. interconnection backlog reached roughly 2.6 terawatts (TW) of active projects through 2023, with median timelines stretching. The Federal Energy Regulatory Commission (FERC) issued Order 2023 to reform study processes and timelines, but implementation takes years. Data‑centre clusters are forming where capacity is available; elsewhere, queues and permitting set the cadence [6].

## Objections and replies

Efficiency will save us. Efficiency helps, but it does not annul the chokepoints, and its pace has slowed. Recent peer‑reviewed work measuring supercomputer energy efficiency from 2008–2023 finds doubling about every 2.29 years, slower than the classic 1.57‑year Koomey trend. When deployment and scale‑out surge faster than efficiency, absolute electricity use still rises, re‑exposing the power bottleneck [7].

Physics won’t bind for decades. It is true that Landauer’s bound is far away for room‑temperature, irreversible digital computing, and that reversible or alternative paradigms could push it further. But the binding constraints we observe in the field are not thermodynamic ceilings; they are interconnection, cooling, HBM stacks, and packaging throughput. Over the next planning cycle, grids and supply chains, not thermodynamics, set the pace [2].

New paradigms will leapfrog constraints. Optical, analog, neuromorphic, and quantum approaches may change the frontier mix. Any paradigm that reaches scale will still need power at the fence line, memory‑hierarchy throughput, packaging, tools, materials, and skilled labor—the very chokepoints already binding. In the near term, infrastructure rather than device physics is the critical path [6].

## The strategic upshot: a conditional

A useful way to read “almost unlimited” is as a conditional: the race continues at pace if, and only if, jurisdictions and firms jointly clear power, bandwidth, and political‑economy bottlenecks. On power, scale requires firm, low‑carbon supply near compute hubs and faster interconnection. The playbook includes life‑extending or restarting nuclear units via PPAs, siting Small Modular Reactors (SMRs; factory‑built reactors designed for modular deployment) near major clusters, building High‑Voltage Direct Current (HVDC) lines to move bulk power efficiently, and using demand‑response architectures for training workloads that can align with variable renewables. The Microsoft–Constellation arrangement is an early case study: it couples compute to durable, schedulable power rather than spot markets alone [8].

On bandwidth, treat HBM and advanced packaging as first‑class industrial policy: predictable multi‑year offtake, geographically diversified capacity, workforce pipelines for outsourced semiconductor assembly and test‑like steps (OSAT; specialized packaging and assembly vendors), and tool‑vendor expansions. Road‑mapping substrate and interposer supply with the same discipline used for wafers reduces calendar‑time variance on cluster deliveries [9].

On politics, expect continued export‑control iteration, local‑content rules, and strategic capital‑expenditure competitions. For firms, that means dual‑sourcing, build‑operate‑transfer models with utilities, and hedges against policy shocks. For states, it means aligning transmission, permitting, and energy‑procurement timelines with digital‑infrastructure build cycles—a governance challenge more than a physics one [10].

## Where “Alpha‑Evolve” systems change the tempo

If AI‑native scientific platforms—“Alpha‑Evolve”‑style engines that integrate model‑guided search, simulation, and robotics—make hypothesis generation and experiment design vastly cheaper, they accelerate the rate of problem discovery. That raises the shadow price of compute: more promising lines of inquiry mean more simulations to run, more models to train, and more inference to deploy across laboratories and factories. Scientific method is compute‑elastic: when we lower the cost of searching design spaces in proteins, materials, or circuits, activity expands to fill the new frontier. When discovery tasks decompose into many weakly coupled experiments, discovery throughput tends to scale close to linearly with available compute until another bottleneck binds. The loop—compute → discovery → economic value → reinvested compute—is self‑reinforcing [14, 15].

## Bottom line

The race for more computing is “almost” unlimited only under a Power–Bandwidth–Politics condition. Demand will not run out first; physics will not bind first. The binding near‑term constraints are societal: electricity and cooling, memory/packaging throughput, and the capital‑geopolitics of the supply chain. Clear those—by accelerating grid and nuclear or other firm‑power deals, expanding HBM and packaging, and coordinating interconnection and export policy—and the race continues for another decade of doublings. Neglect them, and “almost” becomes “not for long.” The empirical record on compute growth and efficiency supports this diagnosis, and the live moves by hyperscalers to lock in nuclear power and by suppliers to expand packaging indicate that the race has already migrated from transistor physics to infrastructure and institutions [1, 3, 4, 7, 8, 9].

---

Further recent reporting: Reuters on the U.S. Energy Information Administration’s record‑use outlook linked to data‑centre demand (2025‑06‑10); the Wall Street Journal on the IEA’s AI‑driven surge in data‑centre electricity; The Verge on an AMD–Department of Energy AI supercomputer partnership; The Guardian and Politico on the Three Mile Island restart arrangements with Microsoft; Reuters on U.S. congressional proposals around AI chips and on prospective EU semiconductor support; and The Guardian on water constraints around data‑centre growth in Latin America.

[1]: https://epoch.ai/blog/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year "Epoch AI — Training compute of frontier AI models grows by 4–5× per year"

[2]: https://pubmed.ncbi.nlm.nih.gov/22398556/ "Experimental verification of Landauer's principle"

[3]: https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai "IEA — Energy demand from AI"

[4]: https://www.reuters.com/technology/nvidia-supplier-sk-hynix-says-hbm-chips-almost-sold-out-2025-2024-05-02/ "Reuters — SK hynix HBM sold out"

[5]: https://www.reuters.com/technology/asml-ships-first-high-na-lithography-system-intel-statement-2023-12-21/ "Reuters — ASML ships first High‑NA EUV"

[6]: https://emp.lbl.gov/sites/default/files/2024-04/Queued%20Up%202024%20Edition_1.pdf "LBNL — Interconnection queue analysis; FERC Order 2023 context"

[7]: https://link.springer.com/article/10.1007/s10586-024-04767-y "Springer — Evolution of computing energy efficiency"

[8]: https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/09/20/accelerating-the-addition-of-carbon-free-energy-an-update-on-progress/ "Microsoft — Carbon‑free energy PPAs"

[9]: https://www.trendforce.com/news/2024/02/19/insights-cowos-capacity-shortage-challenges-ai-chip-demand-while-taiwanese-manufacturers-expand-to-seize-opportunities/ "TrendForce — CoWoS capacity and packaging"

[10]: https://www.bis.gov/press-release/commerce-strengthens-restrictions-advanced-computing-semiconductors-enhance-foundry-due-diligence-prevent "U.S. BIS — Advanced‑computing export controls"

[11]: https://openai.com/index/ai-and-compute/ "OpenAI — AI and Compute"

[12]: https://arxiv.org/abs/2203.15556 "Training Compute‑Optimal Large Language Models"

[13]: https://www.trendforce.com/news/2025/01/02/news-tsmc-set-to-expand-cowos-capacity-to-record-75000-wafers-in-2025-doubling-2024-output/ "TrendForce — TSMC to 75k CoWoS wafers in 2025"

[14]: https://www.nature.com/articles/s41586-023-06735-9 "Nature — Scaling deep learning for materials discovery (GNoME)"

[15]: https://www.nature.com/articles/s41586-023-06734-w "Nature — An autonomous laboratory for accelerated synthesis"

[18]: https://en.wikipedia.org/wiki/Jevons_paradox "Jevons paradox"

[16]: https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2022/08/09/fact-sheet-chips-and-science-act-will-lower-costs-create-jobs-strengthen-supply-chains-and-counter-china/ "White House — CHIPS and Science Act"

[17]: https://hai.stanford.edu/news/decoding-white-house-ai-executive-orders-achievements "Stanford HAI — Decoding the AI Executive Order"
