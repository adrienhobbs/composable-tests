// IDEA create a debounced ISTYPING COMPOSABLE

import { ref, watchEffect, onUnmounted, type Ref } from 'vue'

type Callback = (...args: any[]) => void
type Callable = (...args: any[]) => Function

interface Subscription {
  callback: Callback
  once: boolean
}

export function useToggle(
  initialValue: boolean = false
): [Callable, Callable, () => void, Ref<boolean>] {
  const booleanValue = ref(initialValue)
  const callbacksTrue: Subscription[] = []
  const callbacksFalse: Subscription[] = []

  const register = (callbacks: Subscription[], callback: Callback, once = false) => {
    const subscription = { callback, once }
    callbacks.push(subscription)

    return () => {
      const index = callbacks.indexOf(subscription)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  const registerTrueCallback = (callback: Callback, options = { once: false }) => {
    return register(callbacksTrue, callback, options.once)
  }

  const registerFalseCallback = (callback: Callback, options = { once: false }) => {
    return register(callbacksFalse, callback, options.once)
  }

  const toggleBooleanValue = () => {
    booleanValue.value = !booleanValue.value
  }

  const triggerCallbacks = (value: boolean, callbacks: Subscription[]) => {
    callbacks.forEach((subscription) => {
      subscription.callback(value)
      if (subscription.once) {
        const index = callbacks.indexOf(subscription)

        if (index !== -1) {
          callbacks.splice(index, 1)
        }
      }
    })
  }

  watchEffect(() => {
    const callbacks = booleanValue.value ? callbacksTrue : callbacksFalse
    triggerCallbacks(booleanValue.value, callbacks)
  })

  onUnmounted(() => {
    callbacksTrue.length = 0
    callbacksFalse.length = 0
  })

  return [registerTrueCallback, registerFalseCallback, toggleBooleanValue, booleanValue]
}
