# finformatics: Predictive Modeling for Retail Wealth Diversification

An AI-powered investment advisory platform built with React and TypeScript that provides personalized portfolio recommendations based on comprehensive investor profiling. The application uses a multi-factor risk-based model to generate customized asset allocation strategies for the Indian financial market.

---

## 🚀 Live Demo

[https://www.finformatics.org/](https://www.finformatics.org/)

---

## ✨ Key Features

### 📱 Responsive Modern UI
- **Dual Interface**: Tabs for mobile (Personal/Financial sections) and two-column layout for desktop
- **Dark/Light/System Theme**: Built-in theme toggle with proper dark mode support
- **Gradient Branding**: Professional gradient headers with stock market bull background images (theme-appropriate bull images for light/dark modes)
- **Accessibility**: Full keyboard navigation and screen reader support

### 📊 Advanced Investment Modeling
- **Multi-Factor Analysis**: Considers 8+ factors including age, education, income stability, market awareness, and risk appetite
- **Crypto Eligibility**: Includes crypto allocation for investors under 45 with financial market awareness
- **5-Year Projections**: Interactive bar charts showing projected returns over time
- **Asset Allocation**: Interactive pie charts with detailed breakdowns and tooltips
- **Factor Explanations**: Expandable sections showing detailed calculation logic

### 🔄 Interactive Workflow
- **Calculate Strategy**: Button-triggered calculation with loading animation
- **Modal Results**: All results displayed in a comprehensive modal for focused viewing
- **Real-time Updates**: Form changes automatically reset calculations
- **Reset Functionality**: One-click reset to start over with default conservative profile

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React 18** | UI Framework | 18.3.1 |
| **TypeScript** | Type Safety | 5.8.3 |
| **Vite** | Build Tool & Dev Server | 5.4.19 |
| **Tailwind CSS** | Utility-First Styling | 3.4.17 |
| **shadcn/ui** | Accessible UI Components | Latest |
| **Recharts** | Data Visualization | 2.15.4 |
| **React Router** | Client-Side Routing | 6.30.1 |
| **Lucide React** | Icon Library | 0.462.0 |
| **next-themes** | Theme Management | 0.3.0 |
| **Vitest** | Testing Framework | 3.2.4 |

---

## 📋 How to Use

### 1. Complete Investor Profile
Fill in all fields in the two sections:

**Personal Details:**
- **Name**: Your name (optional)
- **Age**: 18-120 (with +/- buttons, minimum 18)
- **Education Background**: 12 options including Commerce, B.Tech, M.B.A/Ph.D., etc.
- **Annual Income**: 4 ranges from "0-25K" to "More than 125K"

**Financial Profile:**
- **Source of Income**: Self-employed, Salary, Retirement Funds, or Savings
- **Financial Market Awareness**: Yes/No toggle
- **Risk Appetite**: Slider from 0 (conservative) to 20 (aggressive)
- **Capital Range**: 4 options from "0-25K" to "Over 75K"

### 2. Calculate Investment Strategy
Click the **"Calculate Investment Strategy"** button to generate personalized recommendations. A loading animation will show while calculations are processed.

### 3. Review Results in Modal
All results appear in a detailed modal with:
- **Projected Returns Chart**: 5-year returns and cumulative values with simulated market volatility (±2%)
- **Asset Allocation**: Pie chart and detailed allocation list
- **Suggested Investment**: Personalized amount within your capital range
- **Risk Analysis**: Expected annual return and investor category
- **Factor Analysis**: Expandable section showing detailed calculation factors

### 4. Reset or Modify
- Click **"Reset & Start Over"** to return to default conservative profile
- Modify any field and recalculate for updated recommendations

---

## 📊 Input Fields

| Field | Type | Options / Range | Purpose |
|-------|------|-----------------|---------|
| **Name** | Text | Free text | Investor identification |
| **Age** | Number | 18–120 (with +/- buttons) | Determines investor category and risk capacity |
| **Education Background** | Dropdown | 12 options: Commerce, B.Tech, B.B.A / Hotel Management, M.B.A / Ph.D., Arts/Humanities, Science, Medicine, Law, CA/CS, Diploma, No Formal Education, Others | Financial literacy assessment |
| **Annual Income** | Dropdown | 0-25K, 25K-75K, 75K-125K, More than 125K | Financial capacity evaluation |
| **Source of Income** | Dropdown | Self-employed, Salary, Retirement Funds, Savings | Income stability analysis |
| **Financial Market Awareness** | Radio | Yes / No | Adjusts knowledge factor and risk tolerance |
| **Risk Appetite** | Slider | 0–20 (integer) | Core risk factor for allocation strategy |
| **Capital Range** | Dropdown | 0-25K, 25K-50K, 50K-75K, Over 75K | Sets investment range boundaries |

---

## 🧠 Investment Model Logic

### Core Factors

The model considers **8 primary factors** that influence recommendations:

1. **Age Factor**: Younger investors (≤30) get 1.0, mid-career (31-50) get 0.9, conservative (>50) get 0.8
2. **Knowledge Factor**: Based on education background and financial market awareness (0.9-1.1)
3. **Stability Factor**: Based on income source and range (0.9-1.1)
4. **Combined Factor**: Knowledge × Stability (0.81-1.21)
5. **Risk Appetite**: User input 0-20 scale
6. **Capital Range**: Determines investment bounds
7. **Education Impact**: Fine-grained categorization of financial literacy
8. **Income Impact**: Stability and capacity assessment

### Expected Return Calculation

```
Expected Return = baseReturn × ageFactor × combinedFactor

Where:
baseReturn = 6 + (riskAppetite / 20) × 8  // Ranges from 6% to 14%
ageFactor = age ≤ 30 ? 1.0 : age ≤ 50 ? 0.9 : 0.8
combinedFactor = knowledgeFactor × stabilityFactor
```

### Investor Categorization

| Age Range | Category | Description |
|-----------|----------|-------------|
| ≤ 25 | Very Young Investor | Maximum growth potential |
| 26-35 | Young Investor | High risk tolerance |
| 36-45 | Early Mid-Career Investor | Balanced approach |
| 46-55 | Mid-Career Investor | Stability focus |
| 56-65 | Late Career Investor | Capital preservation |
| > 65 | Conservative Investor | Minimal risk |

### Allocation Strategies

#### High Risk (Risk ≥ 15)
- **Equity Focus**: 40% total (25% Large Cap, 15% Mid/Small Cap)
- **Fixed Income**: 35% (20% Government Bonds, 15% Corporate Bonds)
- **Gold**: 15%
- **Fixed Deposits**: 10%

#### Moderate Risk (Risk 8–14)
- **Balanced Mix**: 25% Equity, 40% Bonds (25% Government, 15% Corporate)
- **Gold**: 15%
- **Fixed Deposits**: 20%

#### Low Risk (Risk 0–7)
- **Conservative Focus**: 10% Equity, 45% Bonds (30% Government, 15% Corporate)
- **Gold**: 20%
- **Fixed Deposits**: 25%

### Factor Adjustments
*Note: Base allocation percentages are adjusted by combined factors (age × knowledge × stability). Final allocations may vary based on your specific profile factors.*

### Crypto Eligibility
- **Age**: Under 45 years
- **Risk Appetite**: ≥ 8
- **Market Awareness**: Yes
- **Allocation**: Up to 5% (reallocated from equity proportionally)

### Investment Range Mapping

| Capital Range | Investment Range (₹) |
|---------------|----------------------|
| 0-25K | 5,000 – 25,000 |
| 25K-50K | 25,000 – 50,000 |
| 50K-75K | 50,000 – 75,000 |
| Over 75K | 75,000 – 200,000 |

### Suggested Investment Calculation
```
riskRatio = riskAppetite / 20
suggestedInvestment = rangeMin + (rangeMax − rangeMin) × riskRatio
```

### 5-Year Projections

The model generates 5-year return projections with simulated market volatility:

```
annualReturn = expectedReturn + (randomValue × 4 - 2)  // ±2% volatility
```

Where:
- **expectedReturn**: Your calculated expected annual return
- **randomValue**: Random number between 0 and 1 (changes each year)
- **Result**: Annual returns vary between expectedReturn ± 2%

Each year's return affects the cumulative investment value:
```
yearlyReturn = cumulativeValue × (annualReturn / 100)
cumulativeValue += yearlyReturn
```

**Example**: If your expected return is 10%, annual projections might show:
- Year 1: 11.2%
- Year 2: 9.1%  
- Year 3: 10.5%
- Year 4: 8.8%
- Year 5: 10.9%

This volatility simulation provides realistic scenario planning while maintaining your expected long-term average return.


---

## 🏗️ Project Architecture

```
src/
├── assets/                 # Static assets (logos, animations)
├── components/
│   ├── ui/                 # shadcn/ui component library
│   ├── AllocationChart.tsx # Pie chart visualization
│   ├── InvestorForm.tsx    # Input form with responsive tabs
│   ├── ResultsModal.tsx    # Comprehensive results modal
│   ├── ReturnsBarChart.tsx # 5-year projections chart
│   └── theme-toggle.tsx    # Theme switcher
├── lib/
│   └── investment-model.ts # Core investment computation logic
├── pages/
│   ├── Index.tsx          # Main dashboard with state management
│   └── NotFound.tsx       # 404 page
├── App.tsx                # Router configuration
└── main.tsx              # Application entry point
```

### Key Data Flow

```
User Input (InvestorForm)
    ↓ onChange
Index Page (useState + useRef for stability)
    ↓ handleCalculate
computeInvestment() (Pure function)
    ↓ Returns InvestmentResult
ResultsModal (Display with charts)
```

### State Management
- **React Hooks**: useState, useCallback, useEffect, useRef, useMemo
- **Stable References**: useRef prevents unnecessary re-renders
- **Memoization**: Performance optimization for expensive calculations

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd finformatics-23b5a36e

# Install dependencies
npm install
# or with bun
bun install

# Start development server
npm run dev
# or with bun
bun dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

---

## 📈 Features in Detail

### Responsive Design
- **Mobile**: Tabs interface for Personal/Financial sections
- **Tablet**: Adjusted layouts with optimized spacing
- **Desktop**: Two-column layout with full information display
- **Floating Button**: Mobile-optimized calculate button at bottom

### Visualization Components
- **AllocationChart**: Interactive pie chart with custom labels and tooltips
- **ReturnsBarChart**: Dual-axis bar chart showing annual returns and cumulative values
- **Custom Tooltips**: Detailed hover information with proper data mapping

### User Experience
- **Loading States**: Animated Lottie loading spinner during calculations
- **Input Validation**: Age clamping (18-120), proper number handling
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Prevention**: Timeout cleanup, stable event handlers

### Theme System
- **Light/Dark/System**: Three theme options
- **CSS Variables**: Consistent design tokens
- **Background Images**: Theme-aware stock market bull backgrounds with subtle overlay (light/dark optimized bull imagery)
- **Icon Consistency**: Lucide icons throughout

---

## 🔧 Development

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: AirBnB-inspired rules with React Hooks plugin
- **Prettier**: Consistent formatting
- **Component Structure**: Modular, reusable components

### Testing Strategy
- **Vitest**: Fast testing framework
- **React Testing Library**: User-centric testing
- **Mocking**: Proper mocking of external dependencies
- **Component Tests**: All major components have test coverage

### Performance Optimizations
- **Code Splitting**: Route-based splitting
- **Memoization**: useMemo and useCallback for expensive operations
- **Stable References**: useRef to prevent unnecessary re-renders
- **Lazy Loading**: Components loaded as needed

---

## 📝 Factor Analysis Details

### Knowledge Factor Calculation
```
Base Factor:
- Commerce/BBA/MBA/PhD/CA/CS: 1.1
- B.Tech/Science/Medicine: 1.05
- Arts/Humanities/Law/Diploma/Others: 1.0
- No Formal Education: 0.9

Awareness Factor:
- Aware of financial markets: 1.0
- Not aware: 0.9

Knowledge Factor = round(baseFactor × awarenessFactor, 2)
```

### Stability Factor Calculation
```
Source Factor:
- Salary: 1.05 (Stable regular income)
- Self-employed: 0.95 (Variable income)
- Retirement Funds: 1.0 (Stable but fixed)
- Savings: 0.9 (No active income)

Income Factor:
- More than 125K: 1.1 (High income)
- 75K-125K: 1.05 (Good income)
- 25K-75K: 1.0 (Moderate income)
- 0-25K: 0.9 (Low income)

Stability Factor = round((sourceFactor × 0.6) + (incomeFactor × 0.4), 2)
```

### Combined Factor
```
Combined Factor = round(knowledgeFactor × stabilityFactor, 2)
```

---

## ⚠️ Important Notes

### Default Conservative Profile
The application starts with a conservative default profile:
- **Age**: 18 (minimum)
- **Income**: 0-25K
- **Risk Appetite**: 5 (low-moderate)
- **Market Awareness**: No
- **Capital Range**: 0-25K

This ensures new users start from a safe baseline.

### Floating Point Precision
The model includes safeguards for floating-point arithmetic:
- Tolerance of 0.001 for allocation percentage sums
- Rounding to 2 decimal places for percentages
- Proper handling of division by zero edge cases

### Crypto Allocation Safety
Crypto allocation only appears when:
1. Investor is under 45 years old
2. Risk appetite ≥ 8
3. Financial market awareness = Yes
4. Total equity allocation > 0%

---

## 📄 License

This project is for **academic and educational purposes only**.

## ⚖️ Disclaimer

**IMPORTANT**: This model is for **academic and educational purposes only**. It does not constitute financial advice. The calculations, projections, and recommendations are based on simplified models and assumptions. Past performance does not guarantee future results. Always consult with a certified financial advisor before making investment decisions. The developers assume no liability for any financial decisions made based on this application.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs

---

*Built with ❤️ using modern web technologies*