import { helper } from '@ember/component/helper';

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default helper(function currency([number] /*, named*/) {
  return USD.format(number);
});
