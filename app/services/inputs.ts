import Service from '@ember/service';

import { queryParam } from 'ember-query-params-service';

export const DEXes = [
  'uniswap (ETH)',
  // 'quipiswap (XTZ)'
] as const;

type DEX = typeof DEXes[number];

export default class Inputs extends Service {
  DEXes = DEXes;

  @queryParam({
    deserialize: (qp: string) => Number(qp || '') || 0,
    serialize: (value: number) => value || 100,
  })
  amount = 100;

  @queryParam({
    deserialize: (qp: string) => Number(qp || '') || 0,
    serialize: (value: number) => value || 7,
  })
  averageOver = 7;

  @queryParam weekAverage = true;

  @queryParam dex: DEX = 'uniswap (ETH)';
}
