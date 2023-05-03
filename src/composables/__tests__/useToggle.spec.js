import { ref } from 'vue'
import { test, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useToggle } from '../useToggle'

beforeEach(async (context) => {
  const Component = {
    template: `
      <div>
        <button @click="toggle">Toggle</button>
      </div>
    `,
    setup() {
      const [onTrue, onFalse, toggle, booleanValue] = useToggle()
      const triggeredOnTrue = ref(false)
      const triggeredOnFalse = ref(false)
      const triggeredOnceCount = ref(0)
      const triggeredUnsubscribeCount = ref(0)

      onTrue(() => {
        triggeredOnTrue.value = true
      })

      onTrue(() => {
        triggeredUnsubscribeCount.value++
      })

      onTrue(
        () => {
          triggeredOnceCount.value++
        },
        { once: true }
      )

      onFalse(() => {
        triggeredOnFalse.value = true
      })

      return {
        onTrue,
        onFalse,
        toggle,
        booleanValue,
        triggeredOnTrue,
        triggeredOnFalse,
        triggeredOnceCount,
        triggeredUnsubscribeCount
      }
    }
  }

  context.wrapper = mount(Component)
  context.toggleButton = context.wrapper.find('button')
})

test('booleanValue is correctly toggled', async ({ wrapper, toggleButton }) => {
  toggleButton.trigger('click')
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.booleanValue).toBeTruthy()

  toggleButton.trigger('click')
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.booleanValue).toBeFalsy()
})

test('onTrue callbacks are called', async ({ wrapper, toggleButton }) => {
  toggleButton.trigger('click')
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.triggeredOnTrue).toBe(true)
})

test('onFalse callbacks are called', async ({ wrapper, toggleButton }) => {
  toggleButton.trigger('click')
  toggleButton.trigger('click')
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.triggeredOnFalse).toBe(true)
})

test('once callbacks are only called once', async ({ wrapper, toggleButton }) => {
  toggleButton.trigger('click')
  toggleButton.trigger('click')
  toggleButton.trigger('click')
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.triggeredOnceCount).toEqual(1)
})

test('subscriptions can unsubscribe from events.', async ({ wrapper, toggleButton }) => {
  toggleButton.trigger('click')
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.triggeredUnsubscribeCount).toEqual(1)
})
