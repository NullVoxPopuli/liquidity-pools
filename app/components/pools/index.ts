import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';

import { Data } from './dexes';

import type Inputs from 'liquidity-pools/services/inputs';

export default class Pools extends Component {
  @service declare inputs: Inputs;
  // can the cached implementation be replaced with this?
  //  -> Data is a vanilla class, nothing special
  // @use data = new Data();

  @cached
  get data() {
    let instance = new Data();

    setOwner(instance, getOwner(this));

    return instance;
  }

  get pools() {
    return this.data.currentDex.sortedData;
  }

  get isLoading() {
    return this.data.currentDex.isLoading;
  }

  get description() {
    return this.data.currentDex.description;
  }

  get viable() {
    return this.data.currentDex.viablePercent;
  }

  get total() {
    return this.data.currentDex.totalFetched;
  }
}
