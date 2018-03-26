import * as assert from 'assert'
import {
  Container as InversifyContainer,
  inject as inversifyInject,
  tagged as inversifyTagged,
  injectable as inversifyInjectable,
  decorate as inversifyDecorator
} from 'inversify'
import { makeFluentProvideDecorator } from 'inversify-binding-decorators'
import getInversifyDecorators from 'inversify-inject-decorators'
// import { makeLoggerMiddleware } from 'inversify-logger-middleware'

// interfaces
import { interfaces as inversifyInterfaces } from 'inversify'
const inversifyContainer = new InversifyContainer({ defaultScope: 'Singleton' })
// let logger = makeLoggerMiddleware({
//   request: {
//     bindings: {
//       activated: false,
//       cache: false,
//       constraint: false,
//       dynamicValue: false,
//       factory: false,
//       implementationType: true,
//       onActivation: false,
//       provider: false,
//       scope: false,
//       serviceIdentifier: false,
//       type: false
//     },
//     serviceIdentifier: true,
//     target: {
//       metadata: true,
//       name: false,
//       serviceIdentifier: false
//     }
//   },
//   time: true
// })
// inversifyContainer.applyMiddleware(logger)

const {
  lazyInjectTagged: inversifyLazyInjectTagged,
  lazyInject: inversifyLazyInject
} = getInversifyDecorators(inversifyContainer)
const inversifyfluentProvide = makeFluentProvideDecorator(inversifyContainer)

const INSTANCE_STORAGE: any = {}
const DEFAULT_TAGGED = 'DEFAULT'

export default class Container {
  public container: inversifyInterfaces.Container = inversifyContainer

  public bind<T>(
    target: inversifyInterfaces.Newable<T>,
    type: symbol | string,
    tagged?: any
  ): T {
    const typeStr = typeof type === 'symbol' ? type.toString().replace(/Symbol\((.*)\)/, '$1') : type.toString()

    let map: any = INSTANCE_STORAGE[type]
    if (!map) {
      map = {}
      INSTANCE_STORAGE[type] = map
    }
    if (!tagged) { tagged = DEFAULT_TAGGED }
    const id: string = `${target.name}@${typeStr}@${tagged}`
    assert(typeof map[id] === 'undefined', `Duplicated ${typeStr} defined: ${target.name}(${target.name}@${typeStr}@${tagged})`)
    map[id] = target
    let targetParent = Object.getPrototypeOf(target.prototype).constructor
    while (targetParent !== Object) {
      inversifyDecorator(inversifyInjectable(), targetParent)
      targetParent = Object.getPrototypeOf(targetParent.prototype).constructor
    }
    return inversifyfluentProvide(type)
      .whenTargetTagged(target.name, tagged)
      .done()
      .call(inversifyfluentProvide, target)
  }

  public bindConstantValue(
    constantValue: {},
    serviceIdentifier: string | symbol | inversifyInterfaces.Newable<{}> | inversifyInterfaces.Abstract<{}>,
    type: string | number | symbol,
    tagged?: any
  ) {
    if (!tagged) { tagged = DEFAULT_TAGGED }
    return this.container
      .bind(serviceIdentifier)
      .toConstantValue(constantValue)
      .whenTargetTagged(type, tagged)
  }

  public inject(
    id: string | symbol,
    type: string | symbol,
    tagged?: any
  ) {
    if (!tagged) { tagged = DEFAULT_TAGGED }
    return (target: any, key: string, index?: number) => {
      inversifyTagged(id, tagged)(target, key, index)
      inversifyInject(type)(target, key, index)
    }
  }

  public lazyInject(
    id: string,
    type: string | symbol,
    tagged?: any
  ) {
    if (!tagged) { tagged = DEFAULT_TAGGED }
    return (target: any, key: string) => {
      inversifyLazyInjectTagged(type, id, tagged)(target, key)
    }
  }

  public get<T>(
    serviceIdentifier: string | number | symbol,
    type: string | symbol | inversifyInterfaces.Newable<T> | inversifyInterfaces.Abstract<T>,
    tagged?: any
  ): T {
    if (!tagged) { tagged = DEFAULT_TAGGED }
    return this.container
      .getTagged<T>(type, serviceIdentifier, tagged)
  }

  public getAll<T>(
    type?: string | symbol
  ): T[] {
    if (!type) { return INSTANCE_STORAGE }
    return this.container
      .getAll<T>(type)
  }

  public merge(container: Container): Container {
    this.container = InversifyContainer.merge(this.container, container.container)
    return this
  }

}
