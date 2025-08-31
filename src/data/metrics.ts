export interface KPIMetric {
  id: string;
  value: number;
  label: string;
  icon: string;
  suffix?: string;
  prefix?: string;
}

export interface ResponsibilityLevel {
  level: string;
  year: number;
  responsibilities: number;
}

export interface TechAdoption {
  year: number;
  toolsAdopted: number;
  cumulative: number;
}

export interface ToolUsage {
  category: string;
  percentage: number;
  color: string;
}

export const kpiMetrics: KPIMetric[] = [
  {
    id: "uptime",
    value: 99.9,
    label: "Uptime",
    suffix: "%",
    icon: "Server"
  },
  {
    id: "deployments",
    value: 60,
    label: "Faster Deployments",
    suffix: "%",
    icon: "Rocket"
  },
  {
    id: "mttr",
    value: 40,
    label: "MTTR Reduction",
    suffix: "%",
    icon: "Clock"
  },
  {
    id: "costSavings",
    value: 250000,
    label: "Cost Savings",
    prefix: "$",
    suffix: "k",
    icon: "DollarSign"
  }
];

export const responsibilityGrowth: ResponsibilityLevel[] = [
  { level: "Junior", year: 2019, responsibilities: 3 },
  { level: "Mid", year: 2021, responsibilities: 7 },
  { level: "Senior", year: 2023, responsibilities: 12 },
  { level: "Lead", year: 2024, responsibilities: 18 }
];

export const techAdoptionTimeline: TechAdoption[] = [
  { year: 2019, toolsAdopted: 5, cumulative: 5 },
  { year: 2020, toolsAdopted: 8, cumulative: 13 },
  { year: 2021, toolsAdopted: 12, cumulative: 25 },
  { year: 2022, toolsAdopted: 15, cumulative: 40 },
  { year: 2023, toolsAdopted: 18, cumulative: 58 },
  { year: 2024, toolsAdopted: 22, cumulative: 80 }
];

export const toolUsageBreakdown: ToolUsage[] = [
  { category: "Cloud", percentage: 30, color: "#3B82F6" },
  { category: "IaC", percentage: 25, color: "#10B981" },
  { category: "CI/CD", percentage: 20, color: "#8B5CF6" },
  { category: "Security", percentage: 15, color: "#EF4444" },
  { category: "Monitoring", percentage: 10, color: "#F59E0B" }
];
