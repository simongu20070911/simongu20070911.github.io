---
layout: post
title: The Very Much Programmable New Recurrent Neural Net
date: 2025-11-20 10:00:00 +0000
categories: AI architectures and insights
excerpt: What the new Recurrent Neural Net is?
published: true
---


When OpenAI released GPT5.1-codex-max today optimized for context compaction after exhausting its context window, it seems to me that the traditional recurrent network is being redefined: modern large language models are usually described as feedforward transformers that read a fixed window of text and then forget it, yet the moment we start letting a model rewrite its own history into a compact state and carry that state forward, we have quietly turned the system into a recurrent one. 

This makes the architecture far more controllable than a classic recurrent network: LSTM, RNN is designed so that bias is injected into the architecture by designing controllers, gates, etc this creates more structure for the model's recurrence which strongly mitigate a class of the "gradient explosion" problem of traditional RNNs, but are brittle and rigid, dependent on the exact task. 

this creates a lot of problems because: 1. do not fundamentally eliminate gradient pathologies and 2.their training still scales poorly with sequence length. 

Transformer recurrence, as we defined, entails explicit memory whose size, structure, and update rules can be designed, inspected, logged, reset, or even edited by other agents. 

In effect, we get the long horizon behavior of recurrence without giving up the transparency, parallelism, and empirical scaling properties that made transformers dominant in the first place.

Using reinforcement learning on top of a mostly frozen base model is a clean view to treat compaction as a policy. The model interacts with long contexts, periodically emits a compressed state, and later must solve tasks while seeing only that state plus new inputs. 

RL is applied as follows: whenever it succeeds, the compaction policy is rewarded; whenever a later failure can be traced back to missing or distorted information, the policy is nudged away from that choice. Over many such episodes, the model learns which details are consistently worth preserving, which can be safely discarded, and how to rewrite raw text into internal notes that its own inference machinery can exploit effectively. 

This is conceptually close to how people learn to keep better notes or tell tighter stories: feedback comes not from the elegance of the summary itself but from how well it supports future goals. 
The frontier I think lies in designing memory representations, reward signals, and training curricula that make this self editing, self compressing style of model robust at scale.