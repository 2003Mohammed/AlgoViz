export interface Scenario<T> {
  id: string;
  label: string;
  generate: () => T;
}

const clone = <T,>(values: readonly T[]): T[] => [...values];

const assertValidArrayScenario = (id: string, values: number[], options?: { minLength?: number; maxUnique?: number }) => {
  const minLength = options?.minLength ?? 1;
  if (values.length < minLength) {
    throw new Error(`Scenario "${id}" must produce at least ${minLength} value(s).`);
  }

  if (typeof options?.maxUnique === 'number') {
    const uniqueCount = new Set(values).size;
    if (uniqueCount > options.maxUnique) {
      throw new Error(`Scenario "${id}" exceeded maxUnique constraint.`);
    }
  }
};

const buildStaticArrayScenario = (
  id: string,
  label: string,
  seed: readonly number[],
  options?: { minLength?: number; maxUnique?: number }
): Scenario<number[]> => ({
  id,
  label,
  generate: () => {
    const generated = clone(seed);
    assertValidArrayScenario(id, generated, options);
    return generated;
  }
});

export const SORTING_SCENARIOS: Scenario<number[]>[] = [
  buildStaticArrayScenario('random', 'Random', [42, 17, 68, 3, 95, 27, 51, 12]),
  buildStaticArrayScenario('nearly-sorted', 'Nearly Sorted', [5, 9, 12, 18, 17, 24, 31, 36]),
  buildStaticArrayScenario('reverse-sorted', 'Reverse Sorted', [88, 71, 64, 53, 41, 29, 16, 7]),
  buildStaticArrayScenario('few-unique', 'Few Unique Values', [4, 1, 4, 2, 1, 3, 2, 4], { maxUnique: 4 }),
  buildStaticArrayScenario('already-sorted', 'Already Sorted', [2, 6, 11, 19, 24, 35, 48, 59])
];

export const ARRAY_SCENARIOS: Scenario<number[]>[] = [
  buildStaticArrayScenario('mixed-values', 'Mixed Values', [14, -3, 28, 7, -11, 22]),
  buildStaticArrayScenario('duplicates', 'Duplicates', [9, 2, 9, 5, 2, 9, 1]),
  buildStaticArrayScenario('sorted', 'Sorted', [3, 8, 15, 21, 34, 55]),
  buildStaticArrayScenario('reverse-sorted', 'Reverse Sorted', [55, 34, 21, 15, 8, 3])
];

export const LINKED_LIST_SCENARIOS: Scenario<number[]>[] = [
  buildStaticArrayScenario('short-list', 'Short List', [8, 3, 5]),
  buildStaticArrayScenario('long-list', 'Long List', [11, 7, 19, 23, 4, 15, 28, 31]),
  buildStaticArrayScenario('duplicates', 'With Duplicates', [4, 9, 4, 2, 9, 6])
];

export const STACK_SCENARIOS: Scenario<number[]>[] = [
  buildStaticArrayScenario('balanced-push-pop', 'Balanced Push/Pop', [12, 24, 36, 48]),
  buildStaticArrayScenario('deep-stack-build', 'Deep Stack Build', [5, 10, 15, 20, 25, 30]),
  buildStaticArrayScenario('duplicate-inputs', 'Duplicate Inputs', [7, 7, 14, 14])
];

export const QUEUE_SCENARIOS: Scenario<number[]>[] = [
  buildStaticArrayScenario('service-line', 'Service Line', [101, 104, 108, 113]),
  buildStaticArrayScenario('burst-traffic', 'Burst Traffic', [5, 7, 9, 10, 12, 13]),
  buildStaticArrayScenario('repeated-priority', 'Repeated Priority', [3, 1, 3, 2, 3])
];

export const getScenarioById = <T,>(scenarios: Scenario<T>[], id: string): Scenario<T> =>
  scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
