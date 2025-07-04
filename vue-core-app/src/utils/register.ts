import type { Exception } from "@/http/type"
import type { ErrorListener } from "@/service/error-listener"
import { defineStore, type Store, type DefineStoreOptions, type StoreDefinition } from "pinia"
import { reactive, shallowReactive } from "vue"

export function moduleRegister<M extends Module<any, any>>(module: M) {
  const moduleName: string = module.name
  // if (!app.store.getState().app[moduleName]) {
  //     // To get private property
  //     app.store.dispatch(setStateAction(moduleName, module.initialState, `@@${moduleName}/@@init`));
  // }

  const actionHandlers = {}
  getKeys(module).forEach((actionType) => {
    // Attach action name, for @Log / error handler reflection
    const method = module[actionType]
    const qualifiedActionType = `${actionType}`
    method.actionName = qualifiedActionType

    actionHandlers[qualifiedActionType] = method.bind(module)
  })

  // 绑定 store
  if (module.store) {
    actionHandlers["store"] = module.store as any
  }

  return actionHandlers as ActionCreators<M>
}

function getKeys(module) {
  const keys: string[] = []
  for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
    if (module[propertyName] instanceof Function && propertyName !== "constructor") {
      keys.push(propertyName)
    }
  }
  return keys
}

interface ModuleLifecycleListener<State extends object = object> {
  resetStore: () => void
  setState: <K extends keyof State>(stateOrUpdater: ((state: State) => void) | Pick<State, K> | State) => void
}

type ActionCreator<H> = H extends (...args: infer P) => unknown ? (...args: P) => any : never

type HandlerKeys<H> = { [K in keyof H]: H[K] extends (...args: any[]) => unknown ? K : never }[Exclude<
  keyof H,
  keyof ModuleLifecycleListener | keyof ErrorListener
>]

type ActionCreators<H> = { readonly [K in HandlerKeys<H>]: ActionCreator<H[K]> }

// store

export class Module<State extends Record<string, any>, ModuleName extends string> {
  store: () => any = null
  constructor(
    readonly name: ModuleName,
    readonly initialState?: State,
  ) {
    if (initialState) {
      const def: any = { ...initialState }
      const useStore = defineStore(name, () => {
        const store = reactive<State>({ ...initialState })
        function $reset() {
          //   store.message = null
          //   store.message = def
        }
        return { state: store, $reset }
      })
      this.store = useStore as any
    }
  }

  get state(): Readonly<State> {
    return this.store().state
  }

  resetStore(): void {
    return this.store().$reset()
  }

  setState<K extends keyof State>(stateOrUpdater: ((state: State) => void) | Pick<State, K> | State): void {
    if (typeof stateOrUpdater === "function") {
      //
    } else {
      const partialState = stateOrUpdater as object
      this.setState((state) => Object.assign(state, partialState))
    }
  }
}
