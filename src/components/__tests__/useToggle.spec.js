import { ref } from 'vue'
import { test, expect, describe, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import useToggle from '../../composables/useToggle'

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

      onTrue(() => {
        triggeredOnTrue.value = true
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
        triggeredOnceCount
      }
    }
  }

  context.wrapper = mount(Component)
  context.toggleButton = context.wrapper.find('button')
})

describe('onTrue', () => {
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
})
