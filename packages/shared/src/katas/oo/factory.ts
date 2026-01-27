export type DraftReport = {
  id: string;
  income: number;
  expenses: number;
  net(): number;
};

export function createDraftReport(
  id: string,
  income: number,
  expenses: number,
): DraftReport {
  return {
    id,
    income,
    expenses,
    net() {
      return this.income - this.expenses;
    },
  };
}
