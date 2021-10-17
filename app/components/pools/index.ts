import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';

import { Data } from './dexes';

export default class Pools extends Component {
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
    return this.data.forCurrentDex;
  }

  get isLoading() {
    return this.data.forCurrentDex.length === 0;
  }
}
