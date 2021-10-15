import { helper } from '@ember/component/helper';

export default helper(function round([number, precision] /*, named*/) {
  let factor = Math.pow(10, precision);
  let num = number * factor;

  return Math.round(num) / factor;
});
