---
layout: post
title: "The Power–Bandwidth–Politics Condition: Why the Compute Race Is Conditionally Unbounded"
date: 2025-11-11 10:00:00 +0000
categories: compute policy systems
excerpt: "A rigorous synthesis: demand looks unbounded when scaling works; supply is gated in the 2025–2035 window by power, bandwidth, and political economy."
published: false
---

I came to the “compute race” the way many came to gold or equities—through numbers first and stories later. In 2025, the numbers have been unmissable. Training budgets that once sounded outlandish now look routine; clusters that once felt extravagant now feel undersized. It is tempting to declare the race for computing power “unlimited.” I think a more accurate description is “conditionally unbounded.” Demand behaves as if there is no ceiling; supply reminds us that there is a calendar and a queue.

In this post, I will do what I try to do with markets. I will start by classifying what we mean by “compute,” because taxonomy shapes how we think about pricing and constraints. I will then look at the arc of demand and the mechanics of supply, and I will close with what it means for planning—whether you are a lab head, a policymaker, or an investor deciding where returns will accrue.

The short version: on the demand side, revealed returns at the frontier remain high, so actors behave as if demand were unbounded. On the supply side, growth over the next decade is paced by three chokepoints: power (electricity supply and heat rejection), bandwidth (memory throughput and advanced packaging), and political economy (capital intensity, supply chains, and export controls). By “compute,” I will mean effective compute for frontier workloads—floating‑point operations (FLOPs) actually delivered to training and serving state‑of‑the‑art artificial intelligence (AI) systems after algorithmic and systems efficiencies. By “almost unlimited,” I will mean capable of many further doublings without meeting an intrinsic ceiling this decade. On these definitions, the claim holds only if the system clears the three chokepoints; otherwise growth bends into an S‑curve well before 2035. The data we have suggests demand has behaved as if unbounded; supply is the question [1, 11, 12].

## Compute: Asset, Commodity, Infrastructure, or Institution?

How we classify something drives how we think about its price. Assets throw cash flows; commodities are inputs to production; currencies store value and mediate exchange; collectibles are held for scarcity and narratives. Where does “compute” fit?

Compute is not an asset by itself, but the companies that produce and rent it are. Compute can look like a commodity—you can buy teraFLOPs the way you buy kilowatt‑hours. It is definitely infrastructure: it requires siting, interconnection, cooling and maintenance. And in 2025 it has become an institution: governments measure it, ration it, and subsidize it. That last point matters because it is institutions—not physics—that shape the near‑term path.

Physics still sets the outer boundary. Landauer’s principle tells us there is a minimum energy cost to erasing a bit, and the lab evidence is real. But relative to today’s operations, that bound is distant; grids, memory stacks and policy frameworks bind first [2].

## Why demand feels bottomless

When scaling works, people scale. Training compute for notable models grew roughly four to five times per year from 2010 into mid‑2024; OpenAI’s earlier analysis found an even faster 3.4‑month doubling along the most compute‑intensive frontier runs in 2012–2018 [1, 11]. Measured training algorithmic efficiency—compute needed to hit a fixed capability—roughly doubled about every sixteen months in 2012–2019. DeepMind’s Chinchilla result codified “compute‑optimal” training: smaller dense models, more tokens, lower cost for a given target [12]. Predictably, those savings were redeployed to bigger problems. That is the rebound effect (Jevons paradox) in action [18].

There is a second force at work: compute‑capability feedback. More compute enables models that automate parts of research—hypothesis generation, theorem search, code optimization—and that creates more valuable tasks worth computing. Think of an “Alpha‑Evolve” research engine: given a scientific objective, it proposes hypotheses, spins up thousands of in‑silico experiments in parallel, and triages what to test physically. The first‑order effect is to enlarge the surface area of tractable problems; the second‑order effect is to raise the opportunity cost of not running more compute. This dynamic helps explain why training‑run compute kept rising super‑exponentially: when scale reliably moves the frontier, the equilibrium is to scale until something else binds [14, 15].

Finally, demand is now anchored not only by episodic training but by serving. Inference—the process of running trained models to answer queries—has become a durable base load spread across billions of daily interactions, with training adding peaks. Capital markets have learned to finance long‑lived compute and energy assets against multi‑year AI demand, flattening the cost of capital for hyperscalers and their energy partners. States have noticed. The U.S. CHIPS and Science Act and peer programs in other jurisdictions channel demand toward trusted supply chains; export rules increasingly reference explicit training‑run thresholds near 10^26 FLOPs [16, 17].

## The rest of the story: what binds today

Power, bandwidth, and political economy are the proximate constraints in the 2025–2035 window. Each is scalable in principle, but each imposes a cadence.

Power. The International Energy Agency (IEA) base case projects global data‑centre electricity use roughly doubling by 2030 to on the order of 945 TWh, with AI the key driver. That number is not a law of nature; it is infrastructure: siting, interconnection, long‑term contracts, and cooling. In practice, hyperscalers have begun signing long‑dated nuclear power‑purchase agreements (PPAs; contracts that secure electricity supply for years) to obtain firm, low‑carbon power—for example Microsoft’s twenty‑year deal enabling the restart of Three Mile Island Unit 1, and Amazon Web Services arrangements linked to Susquehanna. The race has migrated from transistors to energy procurement and grid integration [3, 8].

Bandwidth. Today’s frontier accelerators are memory‑ and packaging‑bound as much as they are transistor‑bound. High Bandwidth Memory (HBM; stacked dynamic random‑access memory, DRAM, with very high throughput) and advanced 2.5D/3D packaging—Chip‑on‑Wafer‑on‑Substrate (CoWoS) and hybrid bonding—are the scaling fulcrum and the long pole. In 2024, SK hynix reported HBM sold out for 2024 and almost sold out for 2025. Analysts repeatedly flagged CoWoS capacity as both enabler and bottleneck, with expansions racing to catch up. Vendors are guiding sharp increases—for example, TSMC toward roughly 75,000 CoWoS wafers in 2025, about double 2024 output—but the calendar still bites [4, 9, 13].

Tools and export policy. Lithography keeps advancing—ASML shipped the first High‑NA (high numerical aperture) Extreme Ultraviolet (EUV) modules in late 2023, with early high‑volume manufacturing (HVM) centered on 2026–2027. But each step is slower, costlier, and more capital‑intensive; adoption remains economics‑contingent. In parallel, export rules modulate the flow of advanced tools and chips. Since 2023, the U.S. Bureau of Industry and Security (BIS) has iterated its advanced‑computing rules; the Dutch government has updated ASML licensing (including immersion Deep UV). Economics meets allocation [5, 10].

Institutions and interconnection. Even when power plants exist, interconnection queues and transmission constraints delay energizing large loads. The U.S. interconnection backlog reached roughly 2.6 terawatts (TW) of active projects through 2023. FERC Order 2023 reforms studies and timelines, but implementation takes years. Unsurprisingly, data‑centre clusters are forming where capacity is available; elsewhere, queues and permitting set the tempo [6].

## Objections I hear (and how far they go)

“Efficiency will save us.” Efficiency helps. It does not annul the chokepoints, and its pace has slowed. Recent peer‑reviewed work measuring supercomputer energy efficiency from 2008–2023 finds doubling about every 2.29 years, slower than the classic 1.57‑year Koomey trend. When deployment and scale‑out surge faster than efficiency, absolute electricity use still rises. Power returns to center stage [7].

“Physics won’t bind for decades.” Agreed, as a first approximation. Landauer’s bound is far from today’s operating points, and reversible or alternative paradigms might push further. But the binding constraints you will meet in the field this decade are not thermodynamic ceilings; they are interconnection, cooling, HBM stacks, and packaging throughput. Grids and supply chains, not physics, set the pace to 2030 [2, 4, 9].

“New paradigms will leapfrog constraints.” Perhaps. Optical, analog, neuromorphic, and quantum approaches may change the frontier mix. Any paradigm that reaches scale will still need power at the fence line, memory‑hierarchy throughput, packaging tools, materials, and skilled labor—the same chokepoints. Over the next planning cycle, infrastructure rather than device physics is the critical path [6].

## Investment consequences (and operating playbooks)

Reading “almost unlimited” as a conditional is the right instinct. The race continues at pace if—and only if—jurisdictions and firms jointly clear power, bandwidth, and political‑economy bottlenecks.

On power, scale requires firm, low‑carbon supply near compute hubs and faster interconnection. The playbook includes life‑extending or restarting nuclear units via PPAs, siting Small Modular Reactors (SMRs; factory‑built reactors designed for modular deployment) near major clusters, building High‑Voltage Direct Current (HVDC) to move bulk power efficiently, and using demand‑response architectures for training workloads that can align with variable renewables. Microsoft’s arrangement to restart Three Mile Island Unit 1 is a useful case study: couple compute to schedulable power rather than spot markets [8].

On bandwidth, treat HBM and advanced packaging as first‑class industrial policy: predictable multi‑year offtake, geographically diversified capacity, workforce pipelines for outsourced semiconductor assembly and test‑like steps (OSAT; specialized packaging and assembly vendors), and tool‑vendor expansions. Substrate and interposer supply should be road‑mapped with the same discipline used for wafers to reduce calendar‑time variance on cluster deliveries [4, 9, 13].

On politics, expect continued export‑control iteration, local‑content rules, and strategic capital‑expenditure competitions. For firms, that means dual‑sourcing, build‑operate‑transfer models with utilities, and hedges against policy shocks. For states, it means aligning transmission, permitting, and energy‑procurement timelines with digital‑infrastructure build cycles—a governance challenge more than a physics one [10, 16, 17].

## Where “Alpha‑Evolve” changes the tempo

If AI‑native scientific platforms—“Alpha‑Evolve” engines that integrate model‑guided search, simulation, and robotics—make hypothesis generation and experiment design vastly cheaper, they accelerate the rate of problem discovery. That raises the shadow price of compute: more promising lines of inquiry mean more simulations to run, more models to train, and more inference to deploy across laboratories and factories. Scientific method is compute‑elastic: when we lower the cost of searching design spaces in proteins, materials, or circuits, activity expands to fill the new frontier. When discovery tasks decompose into many weakly coupled experiments, discovery throughput tends to scale close to linearly with available compute until something else binds. The loop—compute → discovery → economic value → reinvested compute—becomes self‑reinforcing [14, 15].

## The bottom line

If you prefer your conclusions blunt: demand will not run out first; physics will not bind first. The binding near‑term constraints are societal—electricity and cooling, memory/packaging throughput, and the capital‑geopolitics of the supply chain. Clear those—by accelerating grid and nuclear (or other firm‑power) deals, expanding HBM and packaging, and coordinating interconnection and export policy—and the race continues for another cycle of doublings. Neglect them, and “almost” becomes “not for long.” The curves we can see—frontier‑run compute growth and energy‑efficiency trends—support this reading; the live moves by hyperscalers to lock in nuclear power and by suppliers to expand packaging suggest the race has already migrated from transistor physics to infrastructure and institutions [1, 3, 4, 7, 8, 9].

---

Further recent reporting: Reuters on the U.S. Energy Information Administration’s record‑use outlook linked to data‑centre demand (2025‑06‑10); the Wall Street Journal on the IEA’s AI‑driven surge in data‑centre electricity; The Verge on an AMD–Department of Energy AI supercomputer partnership; The Guardian and Politico on the Three Mile Island restart arrangements with Microsoft; Reuters on U.S. congressional proposals around AI chips and on prospective EU semiconductor support; and The Guardian on water constraints around data‑centre growth in Latin America.

[Datasets]
- Demand & frontier runs: `/assets/data/demand_compute.csv`
- Energy‑efficiency trend: `/assets/data/efficiency_trend.csv`
- Data‑centre electricity: `/assets/data/data_centre_power_projection.csv`
- Packaging capacity: `/assets/data/packaging_capacity.csv`
- HBM market status: `/assets/data/hbm_market_status.csv`
- Interconnection queue overview: `/assets/data/interconnection_queue_summary.csv`
- Interconnection cadence: `/assets/data/interconnection_cadence.csv`
- Policy timeline: `/assets/data/policy_timeline.csv`
- Power‑purchase agreements (PPAs): `/assets/data/power_deals.csv`

[Workbook]
- Excel workbook with all tables and charts: `/assets/sheets/power-bandwidth-politics.xlsx`

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
