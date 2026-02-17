# Investor Profiling & Multi-Factor Risk-Based Investment Model

An interactive, real-time investment advisory dashboard built with React and TypeScript. It profiles investors based on personal and financial attributes, then recommends a diversified asset allocation strategy tailored to the Indian financial market.

---

## Table of Contents

1. [Overview](#overview)
2. [How to Use](#how-to-use)
3. [Input Fields](#input-fields)
4. [Investment Model Logic](#investment-model-logic)
   - [Investor Categorisation](#investor-categorisation)
   - [Expected Return Calculation](#expected-return-calculation)
   - [Investment Range](#investment-range)
   - [Suggested Investment Amount](#suggested-investment-amount)
   - [Asset Allocation Strategy](#asset-allocation-strategy)
5. [Output Sections](#output-sections)
6. [Project Architecture](#project-architecture)
7. [Technology Stack](#technology-stack)
8. [Running Locally](#running-locally)
9. [Disclaimer](#disclaimer)

---

## Overview

This application implements a **multi-factor risk-based investment model** that takes into account an investor's age, risk appetite, capital availability, income, and financial market awareness to produce personalised investment recommendations. All computations happen client-side with instant, reactive updates—no server or API calls required.

---

## How to Use

1. **Open the dashboard** — the form is on the left, results on the right (desktop) or stacked vertically (mobile).
2. **Fill in your details** — enter your name, age, education, income, and source of income.
3. **Set Financial Market Awareness** — select Yes or No.
4. **Adjust Risk Appetite** — drag the slider between 0 (very conservative) and 20 (very aggressive).
5. **Select Capital Range** — choose the range that matches your available investment capital.
6. **View results instantly** — the right-side panels update in real-time as you change any input:
   - **Risk Analysis** — your expected annual return % and investor category.
   - **Investment Recommendation** — a detailed asset allocation breakdown with a pie chart.
   - **Suggested Investment Amount** — a dollar amount within your capital range, adjusted for risk.

No submit button is needed. All changes are reflected immediately.

---

## Input Fields

| Field                       | Type       | Options / Range                                        | Purpose                          |
| --------------------------- | ---------- | ------------------------------------------------------ | -------------------------------- |
| **Name**                    | Text       | Free text                                              | Investor identification          |
| **Age**                     | Number     | 1–120 (with +/- buttons)                               | Determines investor category     |
| **Education Background**    | Dropdown   | Commerce, B.Tech, B.B.A / Hotel Management, M.B.A / Ph.D. | Demographic profiling            |
| **Income**                  | Dropdown   | 0-25K, 25K-75K, 75K-125K, More than 125K              | Financial capacity assessment    |
| **Source of Income**        | Dropdown   | Self-employed, Salary, Retirement Funds, Savings       | Income stability indicator       |
| **Financial Market Awareness** | Radio   | Yes / No                                               | Adjusts expected return          |
| **Risk Appetite**           | Slider     | 0–20 (integer)                                         | Core risk factor                 |
| **Capital Range**           | Dropdown   | 0-25K, 25K-50K, 50K-75K, Over 75K                     | Sets investment range boundaries |

---

## Investment Model Logic

The core logic resides in `src/lib/investment-model.ts` and follows a deterministic, rule-based approach.

### Investor Categorisation

Based solely on **age**:

| Age Range | Category               |
| --------- | ---------------------- |
| ≤ 30      | Young Investor         |
| 31–50     | Mid-Career Investor    |
| > 50      | Conservative Investor  |

### Expected Return Calculation

```
Expected Return = baseReturn × ageFactor × awarenessFactor
```

| Component           | Formula / Value                                           |
| ------------------- | --------------------------------------------------------- |
| **baseReturn**      | `6 + (riskAppetite / 20) × 8` → ranges from 6% to 14%   |
| **ageFactor**       | Age ≤ 30 → 1.0; Age 31–50 → 0.9; Age > 50 → 0.8        |
| **awarenessFactor** | Aware of markets → 1.0; Not aware → 0.9                  |

The result is rounded to two decimal places.

**Example:** A 28-year-old with risk appetite 12 and market awareness:
- baseReturn = 6 + (12/20) × 8 = 6 + 4.8 = 10.8
- ageFactor = 1.0, awarenessFactor = 1.0
- Expected Return = **10.8%**

### Investment Range

Determined by the selected **Capital Range**:

| Capital Range | Investment Range      |
| ------------- | --------------------- |
| 0-25K         | $1,000 – $5,000      |
| 25K-50K       | $5,000 – $15,000     |
| 50K-75K       | $10,000 – $25,000    |
| Over 75K      | $20,000 – $50,000    |

### Suggested Investment Amount

Calculated as a linear interpolation within the investment range, weighted by risk appetite:

```
riskRatio = riskAppetite / 20
suggestedInvestment = rangeMin + (rangeMax − rangeMin) × riskRatio
```

Higher risk appetite → investment closer to the upper bound. Lower risk → closer to the lower bound.

### Asset Allocation Strategy

Three allocation strategies based on **risk appetite score**:

#### High Risk (Risk ≥ 15)
| Asset Class                           | Allocation |
| ------------------------------------- | ---------- |
| Stock Market (Mid Cap / Blue Chip)    | 40%        |
| Gold Funds / Sovereign Gold Bonds     | 20%        |
| Government Bonds                      | 25%        |
| Fixed Deposits                        | 15%        |

**Strategy:** Aggressive growth with diversified Indian market instruments. Higher equity allocation for long-term wealth accumulation.

#### Moderate Risk (Risk 8–14)
| Asset Class                           | Allocation |
| ------------------------------------- | ---------- |
| Stock Market (Blue Chip / Large Cap)  | 30%        |
| Government Bonds                      | 30%        |
| Gold Funds / Sovereign Gold Bonds     | 20%        |
| Fixed Deposits                        | 20%        |

**Strategy:** Balanced mix of equities and safer instruments. Suitable for moderate risk tolerance.

#### Low Risk (Risk 0–7)
| Asset Class                           | Allocation |
| ------------------------------------- | ---------- |
| Government Bonds                      | 35%        |
| Fixed Deposits                        | 30%        |
| Gold Funds / Sovereign Gold Bonds     | 20%        |
| Stock Market (Large Cap / Index Funds) | 15%       |

**Strategy:** Conservative income-focused approach. Emphasis on capital preservation with fixed-income and gold instruments.

Dollar amounts for each asset class are calculated as:
```
amount = (percentage / 100) × suggestedInvestment
```

---

## Output Sections

### Risk Analysis Card
- **Expected Annual Return (%)** — the computed return percentage.
- **Investor Category** — Young / Mid-Career / Conservative.

### Investment Recommendation Card
- **Asset Allocation List** — each asset with its percentage and dollar amount.
- **Strategy Description** — narrative summary of the recommended approach.
- **Pie Chart** — visual breakdown of the allocation using Recharts.

### Suggested Investment Amount Card
- **Suggested Amount** — the calculated dollar figure.
- **Range** — the minimum and maximum bounds.
- **Disclaimer** — academic-use-only notice.

---

## Project Architecture

```
src/
├── components/
│   ├── InvestorForm.tsx      # Input form with all investor profile fields
│   ├── AllocationChart.tsx   # Pie chart visualisation (Recharts)
│   ├── NavLink.tsx           # Navigation link component
│   └── ui/                   # shadcn/ui component library
├── lib/
│   ├── investment-model.ts   # Core investment computation logic
│   └── utils.ts              # Utility functions (cn helper)
├── pages/
│   ├── Index.tsx             # Main dashboard page (layout + state)
│   └── NotFound.tsx          # 404 page
├── hooks/                    # Custom React hooks
├── App.tsx                   # Router configuration
├── App.css                   # Global styles
├── index.css                 # Tailwind CSS + design tokens
└── main.tsx                  # Application entry point
```

### Key Data Flow

```
InvestorForm (user input)
    ↓ onChange callback
Index page (state holder)
    ↓ useMemo → computeInvestment()
investment-model.ts (pure computation)
    ↓ returns InvestmentResult
Result cards + AllocationChart (display)
```

---

## Technology Stack

| Technology     | Purpose                                  |
| -------------- | ---------------------------------------- |
| React 18       | UI framework                             |
| TypeScript     | Type safety                              |
| Vite           | Build tool & dev server                  |
| Tailwind CSS   | Utility-first styling                    |
| shadcn/ui      | Pre-built accessible UI components       |
| Recharts       | Pie chart visualisation                  |
| React Router   | Client-side routing                      |
| Lucide React   | Icon library                             |

---

## Running Locally

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Disclaimer

This model is for **academic and educational purposes only**. It does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions.
