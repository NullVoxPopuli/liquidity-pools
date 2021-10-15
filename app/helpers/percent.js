import { helper } from '@ember/component/helper';

export default helper(function percent([num] /*, named*/) {
  return [num * 100];
});
