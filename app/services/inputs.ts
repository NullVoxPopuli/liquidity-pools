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
    defaultValue: 100,
    deserialize: (qp: string) => Number(qp || ''),
    serialize: (value: number) => value,
  })
  amount = 100;

  @queryParam({
    defaultValue: 7,
    deserialize: (qp: string) => Number(qp || ''),
    serialize: (value: number) => value,
  })
  averageOver = 7;

  @queryParam({
    defaultValue: 2,
    deserialize: (qp: string) => Number(qp || ''),
    serialize: (value: number) => value,
  })
  maxControl = 2;

  @queryParam weekAverage = true;

  @queryParam dex: DEX = 'uniswap (ETH)';
}
