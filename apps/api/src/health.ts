import { HealthResponse } from '@hmrc-tax-reports/shared';

export function getHealth(): HealthResponse {
  return { status: 'ok' };
}
