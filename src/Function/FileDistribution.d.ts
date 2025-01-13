// FindDistribution.d.ts
type Employee = {
  id: number;
  score: number;
};

export function FindDistribution(
  employeeData: Employee[],
  id: number | null,
  setRange: (range: number | null) => void
): number[];
