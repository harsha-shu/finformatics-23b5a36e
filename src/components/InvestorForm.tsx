import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface InvestorProfile {
  name: string;
  age: number;
  educationBackground: string;
  income: string;
  sourceOfIncome: string;
  awareOfFinancialMarkets: boolean;
  riskAppetite: number;
  capitalRange: string;
}

interface InvestorFormProps {
  profile: InvestorProfile;
  onChange: (profile: InvestorProfile) => void;
}

const educationOptions = [
  "Commerce",
  "B.Tech",
  "B.B.A / Hotel Management",
  "M.B.A / Ph.D.",
];

const incomeRanges = ["0-25K", "25K-75K", "75K-125K", "More than 125K"];

const sourceOfIncomeOptions = [
  "Self-employed",
  "Salary",
  "Retirement Funds",
  "Savings",
];

const capitalRanges = ["0-25K", "25K-50K", "50K-75K", "Over 75K"];

export function InvestorForm({ profile, onChange }: InvestorFormProps) {
  const update = (partial: Partial<InvestorProfile>) =>
    onChange({ ...profile, ...partial });

  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Name</Label>
        <Input
          value={profile.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Your name"
          className="bg-muted/50"
        />
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Age</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={profile.age}
            onChange={(e) => update({ age: Math.max(1, parseInt(e.target.value) || 1) })}
            className="bg-muted/50 flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => update({ age: Math.max(1, profile.age - 1) })}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => update({ age: Math.min(120, profile.age + 1) })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Education Background */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Education Background</Label>
        <Select
          value={profile.educationBackground}
          onValueChange={(v) => update({ educationBackground: v })}
        >
          <SelectTrigger className="bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {educationOptions.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Income */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Income</Label>
        <Select
          value={profile.income}
          onValueChange={(v) => update({ income: v })}
        >
          <SelectTrigger className="bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {incomeRanges.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Source of Income */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Source of Income</Label>
        <Select
          value={profile.sourceOfIncome}
          onValueChange={(v) => update({ sourceOfIncome: v })}
        >
          <SelectTrigger className="bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sourceOfIncomeOptions.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aware of Financial Markets */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Aware of Financial Markets</Label>
        <RadioGroup
          value={profile.awareOfFinancialMarkets ? "yes" : "no"}
          onValueChange={(v) => update({ awareOfFinancialMarkets: v === "yes" })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="aware-yes" />
            <Label htmlFor="aware-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="aware-no" />
            <Label htmlFor="aware-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Risk Appetite 0-20 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Scale of Risk (0–20)</Label>
          <span className="text-sm font-semibold text-primary">{profile.riskAppetite}</span>
        </div>
        <Slider
          value={[profile.riskAppetite]}
          onValueChange={([v]) => update({ riskAppetite: v })}
          max={20}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>20</span>
        </div>
      </div>

      {/* Capital Range */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Range of Capital</Label>
        <Select
          value={profile.capitalRange}
          onValueChange={(v) => update({ capitalRange: v })}
        >
          <SelectTrigger className="bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {capitalRanges.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
