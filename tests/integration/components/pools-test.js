import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | pools', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Pools />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Pools>
        template block text
      </Pools>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
