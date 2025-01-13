// FindDistribution.ts
type Employee = {
  id: number;
  score: number;
};

export const FindDistribution = (
  employeeData: Employee[],
  id: number | null,
  setRange: (range: number | null) => void,
  distriIds: number[][] | null,
  setDistriIds: (distriIds: number[][] | null) => void
): number[] => {
  const distribution: { [key: string]: number } = {
    "0-10": 0,
    "11-20": 0,
    "21-30": 0,
    "31-40": 0,
    "41-50": 0,
    "51-60": 0,
    "61-70": 0,
    "71-80": 0,
    "81-90": 0,
    "91-100": 0,
  };
  const distributionMembers: { [key: string]: number[] } = {
    "0-10": [],
    "11-20": [],
    "21-30": [],
    "31-40": [],
    "41-50": [],
    "51-60": [],
    "61-70": [],
    "71-80": [],
    "81-90": [],
    "91-100": [],
  };

  let rangeIndex: number | null = null;

  employeeData.forEach((employee) => {
    const score = employee.score;

    if (score >= 0 && score <= 10) {
      distribution["0-10"] += 1; // Increment distribution count
      distributionMembers["0-10"].push(employee.id); // Add ID to distributionMembers
      if (id === employee.id && rangeIndex === null) rangeIndex = 0;
    } else if (score >= 11 && score <= 20) {
      distribution["11-20"] += 1;
      distributionMembers["11-20"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 1;
    } else if (score >= 21 && score <= 30) {
      distribution["21-30"] += 1;
      distributionMembers["21-30"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 2;
    } else if (score >= 31 && score <= 40) {
      distribution["31-40"] += 1;
      distributionMembers["31-40"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 3;
    } else if (score >= 41 && score <= 50) {
      distribution["41-50"] += 1;
      distributionMembers["41-50"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 4;
    } else if (score >= 51 && score <= 60) {
      distribution["51-60"] += 1;
      distributionMembers["51-60"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 5;
    } else if (score >= 61 && score <= 70) {
      distribution["61-70"] += 1;
      distributionMembers["61-70"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 6;
    } else if (score >= 71 && score <= 80) {
      distribution["71-80"] += 1;
      distributionMembers["71-80"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 7;
    } else if (score >= 81 && score <= 90) {
      distribution["81-90"] += 1;
      distributionMembers["81-90"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 8;
    } else if (score >= 91 && score <= 100) {
      distribution["91-100"] += 1;
      distributionMembers["91-100"].push(employee.id);
      if (id === employee.id && rangeIndex === null) rangeIndex = 9;
    }
  });

  if (id !== null) {
    console.log("Range",rangeIndex);
    
    setRange(rangeIndex);
  }
  if(distriIds!==null)
  {
    setDistriIds(Object.values(distributionMembers))
  }
  return Object.values(distribution);
};
