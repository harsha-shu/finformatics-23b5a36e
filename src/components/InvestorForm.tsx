import { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
import { Minus, Plus, Info, User, BarChart } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  "Arts/Humanities",
  "Science",
  "Medicine",
  "Law",
  "CA/CS",
  "Diploma",
  "No Formal Education",
  "Others",
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
  // Use a ref to keep the latest profile without causing re-renders
  const profileRef = useRef(profile);

  // Update ref when profile changes
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Stable update function that doesn't depend on changing profile
  const update = useCallback(
    (partial: Partial<InvestorProfile>) => {
      onChange({ ...profileRef.current, ...partial });
    },
    [onChange], // Only depends on onChange which is stable
  );

  // Handlers for specific fields - now stable because update is stable
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      update({ name: e.target.value });
    },
    [update],
  );

  const handleAgeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      update({ age: Math.max(1, parseInt(e.target.value) || 1) });
    },
    [update],
  );

  const handleAgeDecrement = useCallback(() => {
    update({ age: Math.max(1, profile.age - 1) });
  }, [profile.age, update]);

  const handleAgeIncrement = useCallback(() => {
    update({ age: Math.min(120, profile.age + 1) });
  }, [profile.age, update]);

  const handleEducationChange = useCallback(
    (value: string) => {
      update({ educationBackground: value });
    },
    [update],
  );

  const handleIncomeChange = useCallback(
    (value: string) => {
      update({ income: value });
    },
    [update],
  );

  const handleSourceOfIncomeChange = useCallback(
    (value: string) => {
      update({ sourceOfIncome: value });
    },
    [update],
  );

  const handleMarketAwarenessChange = useCallback(
    (value: string) => {
      update({ awareOfFinancialMarkets: value === "yes" });
    },
    [update],
  );

  // Memoize slider handler with stable reference
  const handleRiskAppetiteChange = useCallback(
    (value: number[]) => {
      update({ riskAppetite: value[0] });
    },
    [update],
  );

  const handleCapitalRangeChange = useCallback(
    (value: string) => {
      update({ capitalRange: value });
    },
    [update],
  );

  // Personal Details JSX
  const personalDetails = useMemo(
    () => (
      <div className="space-y-4 sm:space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Name</Label>
          <Input
            value={profile.name}
            onChange={handleNameChange}
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
              onChange={handleAgeChange}
              className="bg-muted/50 flex-1"
              min="18"
              max="120"
              step="1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAgeDecrement}
              className="h-10 w-10 sm:h-9 sm:w-9"
              aria-label="Decrease age"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAgeIncrement}
              className="h-10 w-10 sm:h-9 sm:w-9"
              aria-label="Increase age"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Education Background */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Education Background
          </Label>
          <Select
            value={profile.educationBackground}
            onValueChange={handleEducationChange}
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {educationOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Annual Income */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Annual Income</Label>
          <Select value={profile.income} onValueChange={handleIncomeChange}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {incomeRanges.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
    [
      profile.name,
      profile.age,
      profile.educationBackground,
      profile.income,
      handleNameChange,
      handleAgeChange,
      handleAgeDecrement,
      handleAgeIncrement,
      handleEducationChange,
      handleIncomeChange,
    ],
  );

  // Financial Profile JSX
  const financialProfile = useMemo(
    () => (
      <div className="space-y-4 sm:space-y-6">
        {/* Source of Income */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Source of Income
          </Label>
          <Select
            value={profile.sourceOfIncome}
            onValueChange={handleSourceOfIncomeChange}
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sourceOfIncomeOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aware of Financial Markets */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Aware of Financial Markets
          </Label>
          <RadioGroup
            value={profile.awareOfFinancialMarkets ? "yes" : "no"}
            onValueChange={handleMarketAwarenessChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="aware-yes" />
              <Label htmlFor="aware-yes" className="text-sm sm:text-base">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="aware-no" />
              <Label htmlFor="aware-no" className="text-sm sm:text-base">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Risk Appetite 0-20 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-sm text-muted-foreground">
                Scale of Risk (0–20)
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Risk scale from 0 (very conservative) to 20 (very
                    aggressive).
                    <br />
                    <br />
                    <strong>0-7:</strong> Low Risk - Focus on capital
                    preservation
                    <br />
                    <strong>8-14:</strong> Moderate Risk - Balanced growth
                    <br />
                    <strong>15-20:</strong> High Risk - Aggressive growth
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-semibold text-primary">
              {profile.riskAppetite}
            </span>
          </div>
          <Slider
            value={[profile.riskAppetite]}
            onValueChange={handleRiskAppetiteChange}
            max={20}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 (Conservative)</span>
            <span>20 (Aggressive)</span>
          </div>
        </div>

        {/* Capital Range */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Range of Capital
          </Label>
          <Select
            value={profile.capitalRange}
            onValueChange={handleCapitalRangeChange}
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {capitalRanges.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
    [
      profile.sourceOfIncome,
      profile.awareOfFinancialMarkets,
      profile.riskAppetite,
      profile.capitalRange,
      handleSourceOfIncomeChange,
      handleMarketAwarenessChange,
      handleRiskAppetiteChange,
      handleCapitalRangeChange,
    ],
  );

  return (
    <>
      {/* Mobile: Tabs Interface (hidden on medium screens and up) */}
      <div className="lg:hidden">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="personal"
              className="flex items-center gap-2 py-3"
            >
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Personal</span>
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="flex items-center gap-2 py-3"
            >
              <BarChart className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Financial</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="space-y-4">
            {personalDetails}
          </TabsContent>
          <TabsContent value="financial" className="space-y-4">
            {financialProfile}
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Two-column layout (hidden on small screens) */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6 xl:gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Personal Details</h3>
          </div>
          {personalDetails}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Financial Profile</h3>
          </div>
          {financialProfile}
        </div>
      </div>
    </>
  );
}
