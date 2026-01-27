type Draft = {
  id: string;
  income: number;
  valid: boolean;
};

export const normalize = (draft: Draft): Draft => ({
  ...draft,
  income: Math.max(0, draft.income),
});

export const validate = (draft: Draft): Draft => ({
  ...draft,
  valid: draft.income > 0,
});

export const enrich = (draft: Draft): Draft => ({
  ...draft,
  id: `draft-${draft.id}`,
});
