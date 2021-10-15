import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';

export default class Inputs extends Service {
  @tracked startingValue = 100;
}
