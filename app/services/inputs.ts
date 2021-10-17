import { tracked } from '@glimmer/tracking';
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

  // @queryParam({
  //   deserialize: (qp: string) => (qp === 'false' ? false : true),
  //   serialize: (value: boolean) => `${value}`,
  // })
  @tracked weekAverage = true;

  @queryParam dex: DEX = 'uniswap (ETH)';
}
