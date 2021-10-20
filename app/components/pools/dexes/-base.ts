import { inject as service } from '@ember/service';

import type Inputs from 'liquidity-pools/services/inputs';

export interface DexData {
  description?: string;
  sortedData: ArrayLike<PoolData>;
  isLoading: boolean;
  viablePercent: number;
  totalFetched: number;
}

export interface PoolData {
  tvl: number;
  id: string;
  name: string;
  rate: number;
  volume: number;
  averageOverVolume: number;
}

export abstract class PoolData {
  @service declare inputs: Inputs;

  get yourShare(): number {
    let starting = this.inputs.amount || 0;

    // return starting / this.tvl;
    return starting / (starting + this.tvl);
  }

  get totalFees() {
    let rateAsDecimal = this.rate / 100;

    return this.volume * rateAsDecimal;
  }

  get expectedPerDay(): number {
    return (this.yourShare * this.totalFees) / this.inputs.averageOver;
  }

  get expectedForSpecifiedDays(): number {
    return this.yourShare * this.totalFees;
  }
}
