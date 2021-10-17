import { inject as service } from '@ember/service';

import { useResource } from 'ember-resources';

import { UniswapData } from './uniswap';

import type Inputs from 'liquidity-pools/services/inputs';

export class Data {
  @service declare inputs: Inputs;

  uniswap = useResource(this, UniswapData);

  get forCurrentDex() {
    switch (this.inputs.dex) {
      case 'uniswap (ETH)':
        return this.uniswap.sortedData;
      // case 'quipiswap (XTZ)':
      //   return [];
      default:
        return [];
    }
  }
}
