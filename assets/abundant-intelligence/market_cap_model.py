"""Scenario modeling for Sam Altman's "Abundant Intelligence" build-out.

Updates include:
- Expanded service layer (MSFT, GOOGL, AMZN, META, ORCL) with allocations of AI revenue pool.
- Tesla downside sensitivity for FSD/storage assumptions.
- Capex burden estimates for major players vs. incremental cash generation.
- Output files: narrative, CSVs, charts, plus Tesla downside report.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Tuple

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


@dataclass
class CompanyBaseline:
    ticker: str
    market_cap_trillions: float
    net_income_billions: float
    pe_multiple: float


@dataclass
class CompanyScenario:
    baseline: CompanyBaseline
    incremental_net_income_billions: float
    rerated_pe: float | None = None

    @property
    def total_net_income(self) -> float:
        return self.baseline.net_income_billions + self.incremental_net_income_billions

    @property
    def applied_multiple(self) -> float:
        return self.rerated_pe or self.baseline.pe_multiple

    @property
    def valuation(self) -> float:
        return self.total_net_income * self.applied_multiple / 1000  # trillions USD


# ---------- Baseline inputs ----------

baseline_data: Dict[str, CompanyBaseline] = {
    "NVDA": CompanyBaseline("NVDA", 4.470, 44.0, 37.5),
    "AMD": CompanyBaseline("AMD", 0.26111, 2.6, 40.0),
    "AAPL": CompanyBaseline("AAPL", 3.775, 97.0, 38.0),
    "ASML": CompanyBaseline("ASML", 0.37885, 7.8, 35.0),
    "MU": CompanyBaseline("MU", 0.18623, 6.0, 31.0),
    "SKH": CompanyBaseline("SKH", 0.17804, 8.0, 22.0),
    "NEE": CompanyBaseline("NEE", 0.14892, 7.3, 20.5),
    "CEG": CompanyBaseline("CEG", 0.10517, 4.0, 26.0),
    "MSFT": CompanyBaseline("MSFT", 3.823, 88.0, 43.0),
    "GOOGL": CompanyBaseline("GOOGL", 2.200, 80.0, 29.0),
    "AMZN": CompanyBaseline("AMZN", 2.353, 55.0, 45.0),
    "META": CompanyBaseline("META", 1.897, 47.0, 27.0),
    "ORCL": CompanyBaseline("ORCL", 0.9325, 15.0, 28.0),
    "TSLA": CompanyBaseline("TSLA", 1.416, 15.0, 90.0),
}

# ---------- Scenario-wide infrastructure assumptions ----------

target_gw_per_week = 1.0
weeks_per_year = 52
gpu_power_share = 0.7
gpu_power_kw = 0.7

accelerators_per_week = (target_gw_per_week * 1_000_000 * gpu_power_share) / gpu_power_kw
accelerators_per_year = accelerators_per_week * weeks_per_year

market_share = {"NVDA": 0.65, "AMD": 0.25, "CUSTOM": 0.10}
asp_per_unit = {"NVDA": 12_000, "AMD": 10_000, "CUSTOM": 9_000}
net_margin_gpu = {"NVDA": 0.38, "AMD": 0.28}

stack_multiplier = 2.8
service_conversion = 0.8

service_share = {
    "AAPL": 0.15,
    "MSFT": 0.20,
    "GOOGL": 0.15,
    "AMZN": 0.12,
    "META": 0.10,
    "ORCL": 0.05,
    "TSLA_ROBOTICS": 0.03,
}

service_net_margin = {
    "AAPL": 0.32,
    "MSFT": 0.35,
    "GOOGL": 0.30,
    "AMZN": 0.32,
    "META": 0.35,
    "ORCL": 0.30,
}

# ---------- ASML tool demand ----------

dies_per_wafer = 70
wafer_multiplier = 4
euv_layers = 22
euv_throughput = 1.1e6
pos_current_high_end = 20
asml_system_price = 0.32
asml_system_margin = 0.28
service_revenue_ratio = 0.25
service_margin = 0.20

# ---------- Memory vendors ----------

hbm_stacks_per_accelerator = 8
hbm_stack_asp = 690
memory_share = {"SKH": 0.60, "MU": 0.30, "OTHER": 0.10}
net_margin_memory = {"SKH": 0.22, "MU": 0.20}

# ---------- Energy producers ----------

capacity_factor = 0.90
energy_price_per_kwh = 0.065
energy_share = {"NEE": 0.40, "CEG": 0.30, "OTHER": 0.30}
energy_net_margin = {"NEE": 0.18, "CEG": 0.22}

# ---------- Tesla parameters ----------

tesla_base = {
    "storage_penetration": 0.35,
    "storage_price_per_kwh": 300,
    "storage_margin": 0.28,
    "storage_share": 0.45,
    "fsd_subscribers_m": 20,
    "fsd_arpu": 1_440,
    "fsd_margin": 0.55,
    "robotics_share": service_share["TSLA_ROBOTICS"],
    "robotics_margin": 0.40,
}

tesla_downside = {
    "storage_penetration": 0.20,
    "storage_price_per_kwh": 220,
    "storage_margin": 0.22,
    "storage_share": 0.35,
    "fsd_subscribers_m": 12,
    "fsd_arpu": 960,
    "fsd_margin": 0.45,
    "robotics_share": service_share["TSLA_ROBOTICS"],
    "robotics_margin": 0.25,
}

# ---------- Ramp / discount assumptions ----------

ramp_years = list(range(2026, 2035))
ramp_utilisation = [0.10, 0.20, 0.40, 0.70, 1.00, 1.10, 1.20, 1.20, 1.20]
discount_rate = 0.10
terminal_growth = 0.03
base_year = 2025


# ---------- Helper functions ----------

def compute_gpu_revenue_total() -> float:
    return sum(accelerators_per_year * share * asp_per_unit[vendor] for vendor, share in market_share.items())


def compute_service_revenue_pool(gpu_revenue_usd: float) -> float:
    return gpu_revenue_usd * stack_multiplier * service_conversion


def compute_stack_capex(gpu_revenue_usd: float) -> float:
    return gpu_revenue_usd * stack_multiplier


def compute_gpu_incremental_net() -> Dict[str, float]:
    return {
        vendor: accelerators_per_year * market_share[vendor] * asp_per_unit[vendor] * net_margin_gpu[vendor] / 1e9
        for vendor in ("NVDA", "AMD")
    }


def compute_asml_incremental_net() -> float:
    wafer_starts = (accelerators_per_year / dies_per_wafer) * wafer_multiplier
    layer_exposures = wafer_starts * euv_layers
    euv_tools_needed = layer_exposures / euv_throughput
    incremental_euv = max(euv_tools_needed - pos_current_high_end, 0)
    systems_net = incremental_euv * asml_system_price * asml_system_margin
    service_net = incremental_euv * asml_system_price * service_revenue_ratio * service_margin
    return systems_net + service_net


def compute_memory_incremental_net() -> Dict[str, float]:
    total_stacks = accelerators_per_year * hbm_stacks_per_accelerator
    stack_revenue = total_stacks * hbm_stack_asp
    return {
        vendor: stack_revenue * memory_share[vendor] * net_margin_memory[vendor] / 1e9
        for vendor in ("SKH", "MU")
    }


def compute_energy_incremental_net() -> Dict[str, float]:
    annual_energy_kwh = target_gw_per_week * weeks_per_year * 8.76e9 * capacity_factor
    annual_revenue = annual_energy_kwh * energy_price_per_kwh
    return {
        vendor: annual_revenue * energy_share[vendor] * energy_net_margin[vendor] / 1e9
        for vendor in ("NEE", "CEG")
    }


def compute_tesla_incremental_net(params: Dict[str, float], service_revenue_pool: float) -> float:
    storage_gwh = target_gw_per_week * weeks_per_year * params["storage_penetration"] * 4
    storage_revenue = storage_gwh * 1e6 * params["storage_price_per_kwh"] * params["storage_share"]
    storage_net = storage_revenue * params["storage_margin"] / 1e9

    fsd_revenue = params["fsd_subscribers_m"] * 1e6 * params["fsd_arpu"]
    fsd_net = fsd_revenue * params["fsd_margin"] / 1e9

    robotics_net = service_revenue_pool * params["robotics_share"] * params["robotics_margin"] / 1e9

    return storage_net + fsd_net + robotics_net


def compute_discounted_pv(incremental_net_base: float) -> Tuple[float, pd.DataFrame]:
    cashflows = []
    for year, factor in zip(ramp_years, ramp_utilisation):
        inc = incremental_net_base * factor
        discount_periods = year - base_year
        pv = inc / (1 + discount_rate) ** discount_periods
        cashflows.append((year, factor, inc, pv))
    df = pd.DataFrame(cashflows, columns=["Year", "Utilisation", "IncrementalNet", "PresentValue"])
    last_cash = df.iloc[-1]["IncrementalNet"]
    terminal_value = (last_cash * (1 + terminal_growth)) / (discount_rate - terminal_growth)
    terminal_pv = terminal_value / (1 + discount_rate) ** (ramp_years[-1] - base_year + 1)
    pv_total = df["PresentValue"].sum() + terminal_pv
    return pv_total, df


def sensitivity_table(
    asp_multipliers: Iterable[float],
    share_values: Iterable[float],
    margin_multipliers: Iterable[float],
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    heat_asp, heat_margin = [], []

    for share in share_values:
        row = []
        for asp_mult in asp_multipliers:
            units = accelerators_per_year * share
            asp = asp_per_unit["NVDA"] * asp_mult
            inc = units * asp * net_margin_gpu["NVDA"] / 1e9
            row.append(inc)
        heat_asp.append(row)

    for share in share_values:
        row = []
        for margin_mult in margin_multipliers:
            units = accelerators_per_year * share
            asp = asp_per_unit["NVDA"]
            margin = net_margin_gpu["NVDA"] * margin_mult
            inc = units * asp * margin / 1e9
            row.append(inc)
        heat_margin.append(row)

    df_asp = pd.DataFrame(heat_asp, index=share_values, columns=asp_multipliers)
    df_margin = pd.DataFrame(heat_margin, index=share_values, columns=margin_multipliers)

    return df_asp, df_margin


# ---------- Main execution ----------

def main() -> None:
    gpu_revenue = compute_gpu_revenue_total()
    service_revenue_pool = compute_service_revenue_pool(gpu_revenue)
    stack_capex_total = compute_stack_capex(gpu_revenue)

    scenarios: Dict[str, CompanyScenario] = {}

    gpu_incremental = compute_gpu_incremental_net()
    scenarios["NVDA"] = CompanyScenario(baseline_data["NVDA"], gpu_incremental["NVDA"], rerated_pe=32.0)
    scenarios["AMD"] = CompanyScenario(baseline_data["AMD"], gpu_incremental["AMD"], rerated_pe=34.0)

    for ticker in ("AAPL", "MSFT", "GOOGL", "AMZN", "META", "ORCL"):
        share = service_share[ticker]
        margin = service_net_margin[ticker]
        incremental_net = service_revenue_pool * share * margin / 1e9
        rerated = {"AAPL": 34.0, "MSFT": 36.0, "GOOGL": 32.0, "AMZN": 38.0, "META": 29.0, "ORCL": 26.0}[ticker]
        scenarios[ticker] = CompanyScenario(baseline_data[ticker], incremental_net, rerated)

    asml_incremental = compute_asml_incremental_net()
    scenarios["ASML"] = CompanyScenario(baseline_data["ASML"], asml_incremental, rerated_pe=37.0)

    memory_incremental = compute_memory_incremental_net()
    scenarios["SKH"] = CompanyScenario(baseline_data["SKH"], memory_incremental["SKH"], rerated_pe=24.0)
    scenarios["MU"] = CompanyScenario(baseline_data["MU"], memory_incremental["MU"], rerated_pe=30.0)

    energy_incremental = compute_energy_incremental_net()
    scenarios["NEE"] = CompanyScenario(baseline_data["NEE"], energy_incremental["NEE"], rerated_pe=22.0)
    scenarios["CEG"] = CompanyScenario(baseline_data["CEG"], energy_incremental["CEG"], rerated_pe=24.0)

    tesla_incremental = compute_tesla_incremental_net(tesla_base, service_revenue_pool)
    scenarios["TSLA"] = CompanyScenario(baseline_data["TSLA"], tesla_incremental, rerated_pe=65.0)

    summary_records = []
    cashflow_frames = {}
    capex_records = []

    for ticker, scenario in scenarios.items():
        pv_total, cf = compute_discounted_pv(scenario.incremental_net_income_billions)
        cashflow_frames[ticker] = cf
        capex_share = service_share.get(ticker, 0.0) * stack_capex_total / 1e9
        capex_records.append({"Ticker": ticker, "CapexShareB": capex_share})
        summary_records.append(
            {
                "Ticker": ticker,
                "BaselineCapT": scenario.baseline.market_cap_trillions,
                "BaselineNetIB": scenario.baseline.net_income_billions,
                "IncrementalNetIB": scenario.incremental_net_income_billions,
                "ScenarioCapT": scenario.valuation,
                "AppliedPE": scenario.applied_multiple,
                "PVIncrementalNI": pv_total,
            }
        )

    summary_df = pd.DataFrame(summary_records).set_index("Ticker").sort_values("ScenarioCapT", ascending=False)
    capex_df = pd.DataFrame(capex_records).groupby("Ticker").sum()

    downside_tesla_inc = compute_tesla_incremental_net(tesla_downside, service_revenue_pool)
    downside_tesla_valuation = (baseline_data["TSLA"].net_income_billions + downside_tesla_inc) * 55.0 / 1000

    out_dir = Path(__file__).parent
    results_path = out_dir / "scenario_results.txt"
    summary_csv = out_dir / "scenario_summary.csv"
    pv_csv = out_dir / "incremental_cashflows.csv"
    capex_csv = out_dir / "capex_vs_incremental_cash.csv"
    tesla_sensitivity_path = out_dir / "tesla_downside.txt"

    summary_df.to_csv(summary_csv)
    all_cashflows = pd.concat({ticker: cf for ticker, cf in cashflow_frames.items()}, names=["Ticker", "Index"])
    all_cashflows.to_csv(pv_csv)

    capex_df["CapexShareB"].to_csv(capex_csv)

    inc_asp, inc_margin = sensitivity_table(
        asp_multipliers=[0.8, 0.9, 1.0, 1.1, 1.2],
        share_values=[0.55, 0.60, 0.65, 0.70, 0.75],
        margin_multipliers=[0.8, 0.9, 1.0, 1.1, 1.2],
    )

    valuation_asp = (baseline_data["NVDA"].net_income_billions + inc_asp) * 32.0 / 1000
    valuation_margin = (baseline_data["NVDA"].net_income_billions + inc_margin) * 32.0 / 1000

    valuation_asp.to_csv(out_dir / "nvda_sensitivity_asp_share.csv")
    valuation_margin.to_csv(out_dir / "nvda_sensitivity_margin_share.csv")

    with results_path.open("w") as fh:
        fh.write("Abundant Intelligence Market-Cap Scenario\n")
        fh.write("========================================\n\n")
        fh.write(f"Target accelerators per year: {accelerators_per_year:,.0f}\n")
        fh.write(f"Total GPU revenue (USD): {gpu_revenue/1e12:.3f} Trillion\n")
        fh.write(f"HBM revenue pool (USD): {accelerators_per_year * hbm_stacks_per_accelerator * hbm_stack_asp / 1e12:.3f} Trillion\n")
        fh.write(f"Energy demand: {target_gw_per_week * weeks_per_year:.0f} GW nameplate annually; {target_gw_per_week * weeks_per_year * 8.76 * capacity_factor:.1f} TWh consumption\n")
        fh.write(f"Service revenue pool: {service_revenue_pool/1e12:.3f} Trillion\n")
        fh.write(f"Stack capex requirement: {stack_capex_total/1e12:.3f} Trillion\n\n")
        fh.write("Company Summary (values in billions unless noted):\n")
        for ticker, row in summary_df.iterrows():
            capex_b = capex_df.loc[ticker, "CapexShareB"] if ticker in capex_df.index else 0.0
            fh.write(f"{ticker}\n")
            fh.write(f"  Baseline market cap: {row['BaselineCapT']:.3f} TUSD\n")
            fh.write(f"  Baseline net income: {row['BaselineNetIB']:.1f} BUSD\n")
            fh.write(f"  Incremental net income @ steady state: {row['IncrementalNetIB']:.1f} BUSD\n")
            fh.write(f"  Scenario valuation (rerated): {row['ScenarioCapT']:.3f} TUSD\n")
            fh.write(f"  Discounted PV of incremental NI (2025 base): {row['PVIncrementalNI']:.1f} BUSD\n")
            fh.write(f"  Annual capex burden (share of stack capex): {capex_b:.1f} BUSD\n")
            ratio = row["IncrementalNetIB"]/capex_b if capex_b else None
            ratio_str = f"{ratio:.1f}" if ratio is not None else "n/a"
            fh.write(f"  Incremental NI / Capex ratio: {ratio_str}\n\n")

        fh.write("NVDA Sensitivity: Valuation (TUSD) by ASP multiplier and share\n")
        fh.write(valuation_asp.to_string(float_format=lambda v: f"{v:.2f}"))
        fh.write("\n\nNVDA Sensitivity: Valuation (TUSD) by margin multiplier and share\n")
        fh.write(valuation_margin.to_string(float_format=lambda v: f"{v:.2f}"))
        fh.write("\n\nNotes:\n")
        fh.write("- Service revenues allocated: Apple 15%, Microsoft 20%, Alphabet 15%, Amazon 12%, Meta 10%, Oracle 5%, Tesla robotics 3%; balance left to other ecosystems.\n")
        fh.write("- Capex burden approximates proportional ownership of total stack capex (2.8× GPU spend).\n")
        fh.write("- Tesla downside: 12M FSD subs at $80/mo, 20% storage attach at $220/kWh, robotics margin 25%.\n")
        fh.write("- PV math: nine-year ramp, 10% discount rate, 3% terminal growth.\n")

    with tesla_sensitivity_path.open("w") as fh:
        fh.write("Tesla Sensitivity\n=================\n")
        fh.write(f"Base incremental net income: {tesla_incremental:.1f} BUSD\n")
        fh.write(f"Base valuation (65x applied P/E): {scenarios['TSLA'].valuation:.3f} TUSD\n\n")
        fh.write(f"Downside incremental net income: {downside_tesla_inc:.1f} BUSD\n")
        fh.write(f"Downside valuation (55x applied P/E): {downside_tesla_valuation:.3f} TUSD\n")

    chart_dir = out_dir

    plt.figure(figsize=(11, 5))
    x = np.arange(len(summary_df))
    width = 0.35
    plt.bar(x - width / 2, summary_df["BaselineCapT"], width=width, label="Baseline", color="#9bb5ff")
    plt.bar(x + width / 2, summary_df["ScenarioCapT"], width=width, label="Scenario", color="#345ff6")
    plt.xticks(x, summary_df.index, rotation=45)
    plt.ylabel("Market cap (Trillions USD)")
    plt.title("Abundant Intelligence Market Cap Projection")
    plt.legend()
    plt.tight_layout()
    plt.savefig(chart_dir / "market_cap_projection.png", dpi=220)
    plt.close()

    plt.figure(figsize=(7, 5))
    im = plt.imshow(valuation_asp.values, cmap="Blues", aspect="auto", origin="lower")
    plt.colorbar(im, fraction=0.046, pad=0.04, label="Valuation (TUSD)")
    plt.xticks(range(len(valuation_asp.columns)), valuation_asp.columns)
    plt.yticks(range(len(valuation_asp.index)), valuation_asp.index)
    plt.xlabel("ASP multiplier vs. base")
    plt.ylabel("NVDA share of accelerators")
    plt.title("NVDA Valuation Sensitivity to Share & ASP")
    for i in range(len(valuation_asp.index)):
        for j in range(len(valuation_asp.columns)):
            plt.text(j, i, f"{valuation_asp.iloc[i, j]:.2f}", ha="center", va="center", color="black", fontsize=8)
    plt.tight_layout()
    plt.savefig(chart_dir / "nvda_sensitivity_heatmap.png", dpi=220)
    plt.close()

    plt.figure(figsize=(9, 5.5))
    for ticker, cf in cashflow_frames.items():
        plt.plot(cf["Year"], cf["IncrementalNet"], label=ticker)
    plt.xlabel("Fiscal Year")
    plt.ylabel("Incremental Net Income (BUSD)")
    plt.title("Ramp Profile: Incremental Net Income by Company")
    plt.legend(ncol=3)
    plt.tight_layout()
    plt.savefig(chart_dir / "incremental_net_income_ramp.png", dpi=220)
    plt.close()

    print(f"Saved scenario text to {results_path}")
    print(f"Saved summary CSV to {summary_csv}")
    print(f"Saved PV cashflows to {pv_csv}")
    print(f"Saved capex summary to {capex_csv}")
    print(f"Saved Tesla downside to {tesla_sensitivity_path}")


if __name__ == "__main__":
    main()
