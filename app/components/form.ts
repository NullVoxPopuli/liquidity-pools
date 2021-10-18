import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';

import { DEXes } from 'liquidity-pools/services/inputs';

import type Inputs from 'liquidity-pools/services/inputs';

export default class FormComponent extends Component {
  @service declare inputs: Inputs;

  updateStartingValue = (e: Event) => {
    assert('expected input!', e.target instanceof HTMLInputElement);
    this.inputs.amount = parseFloat(e.target.value);
  };

  updateAverageOver = (e: Event) => {
    assert('expected input!', e.target instanceof HTMLInputElement);
    this.inputs.averageOver = parseFloat(e.target.value);
  };

  updateMaxControl = (e: Event) => {
    assert('expected input!', e.target instanceof HTMLInputElement);
    this.inputs.maxControl = parseFloat(e.target.value);
  };

  toggle7Day = () => (this.inputs.weekAverage = !this.inputs.weekAverage);

  updateDex = (e: Event) => {
    assert('expected select!', e.target instanceof HTMLSelectElement);
    assert('invalid value', isValidDex(e.target.value));

    this.inputs.dex = e.target.value;
  };
}

function isValidDex(test: string): test is typeof DEXes[0] {
  return (DEXes as unknown as string[]).includes(test);
}
