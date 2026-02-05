import { useState } from "react";
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

export interface InvestorProfile {
  name: string;
  age: number;
  riskAppetite: number;
  capitalRange: string;
}

interface InvestorFormProps {
  profile: InvestorProfile;
  onChange: (profile: InvestorProfile) => void;
}

const capitalRanges = ["0-25K", "25K-50K", "50K-75K", "Over 75K"];

export function InvestorForm({ profile, onChange }: InvestorFormProps) {
  const update = (partial: Partial<InvestorProfile>) =>
    onChange({ ...profile, ...partial });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Enter your name</Label>
        <Input
          value={profile.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Your name"
          className="bg-muted/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Enter your age</Label>
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Risk Appetite (0–50)</Label>
          <span className="text-sm font-semibold text-primary">{profile.riskAppetite}</span>
        </div>
        <Slider
          value={[profile.riskAppetite]}
          onValueChange={([v]) => update({ riskAppetite: v })}
          max={50}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>50</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Capital Range</Label>
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
