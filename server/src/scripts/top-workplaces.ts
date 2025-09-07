interface Workplace {
  id: string;
  name: string;
}

interface Shift {
  id: string;
  workplaceId: string;
  status: string;
}

async function main() {
  try {
    // 1. Fetch workplaces
    const workplacesRes = await fetch("http://localhost:3000/api/workplaces");
    const workplaces: Workplace[] = await workplacesRes.json();

    // 2. Fetch shifts
    const shiftsRes = await fetch("http://localhost:3000/api/shifts");
    const shifts: Shift[] = await shiftsRes.json();

    // 3. Count completed shifts per workplace
    const counts: Record<string, number> = {};
    for (const shift of shifts) {
      if (shift.status === "completed") {
        counts[shift.workplaceId] = (counts[shift.workplaceId] || 0) + 1;
      }
    }

    // 4. Map workplaces → { name, shifts }
    const results = workplaces.map((w) => ({
      name: w.name,
      shifts: counts[w.id] || 0,
    }));

    // 5. Sort + top 3
    const top3 = results.sort((a, b) => b.shifts - a.shifts).slice(0, 3);

    // 6. Output JSON
    console.log(JSON.stringify(top3, null, 2));
  } catch (err) {
    console.error("Error fetching data", err);
    throw err;
  }
}

main();
