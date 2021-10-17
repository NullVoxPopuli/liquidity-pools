import { inject as service } from '@ember/service';

import type Inputs from 'liquidity-pools/services/inputs';

export interface PoolData {
  tvl: number;
  id: string;
  name: string;
  rate: number;
  volume: number;
}

export abstract class PoolData {
  @service declare inputs: Inputs;

  get yourShare(): number {
    let starting = this.inputs.amount || 0;

    return starting / (starting + this.tvl);
  }

  get expectedIncome(): number {
    let rateAsDecimal = this.rate / 100;

    return this.yourShare * (rateAsDecimal * this.volume);
  }
}
