import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';

import type Inputs from 'liquidity-pools/services/inputs';

export default class FormComponent extends Component {
  @service declare inputs: Inputs;

  updateStartingValue = (e: Event) => {
    assert('expected input!', e.target instanceof HTMLInputElement);
    this.inputs.startingValue = parseFloat(e.target.value);
  };
}
