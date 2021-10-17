import { inject as service } from '@ember/service';

import { useResource } from 'ember-resources';

import { UniswapData } from './uniswap';

import type { DexData } from './-base';
import type Inputs from 'liquidity-pools/services/inputs';

export class Data {
  @service declare inputs: Inputs;

  uniswap = useResource(this, UniswapData);

  get currentDex(): DexData {
    switch (this.inputs.dex) {
      case 'uniswap (ETH)':
        return this.uniswap;
      default:
        return {
          sortedData: [],
          isLoading: false,
          totalFetched: 0,
          viablePercent: 0,
          description: 'Unrecognized DEX',
        };
    }
  }
}
