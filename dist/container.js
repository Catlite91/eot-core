"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const inversify_1 = require("inversify");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const inversify_inject_decorators_1 = require("inversify-inject-decorators");
const inversifyContainer = new inversify_1.Container({ defaultScope: 'Singleton' });
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
const { lazyInjectTagged: inversifyLazyInjectTagged, lazyInject: inversifyLazyInject } = inversify_inject_decorators_1.default(inversifyContainer);
const inversifyfluentProvide = inversify_binding_decorators_1.makeFluentProvideDecorator(inversifyContainer);
const INSTANCE_STORAGE = {};
const DEFAULT_TAGGED = 'DEFAULT';
class Container {
    constructor() {
        this.container = inversifyContainer;
    }
    bind(target, type, tagged) {
        const typeStr = typeof type === 'symbol' ? type.toString().replace(/Symbol\((.*)\)/, '$1') : type.toString();
        let map = INSTANCE_STORAGE[type];
        if (!map) {
            map = {};
            INSTANCE_STORAGE[type] = map;
        }
        if (!tagged) {
            tagged = DEFAULT_TAGGED;
        }
        const id = `${target.name}@${typeStr}@${tagged}`;
        assert(typeof map[id] === 'undefined', `Duplicated ${typeStr} defined: ${target.name}(${target.name}@${typeStr}@${tagged})`);
        map[id] = target;
        let targetParent = Object.getPrototypeOf(target.prototype).constructor;
        while (targetParent !== Object) {
            inversify_1.decorate(inversify_1.injectable(), targetParent);
            targetParent = Object.getPrototypeOf(targetParent.prototype).constructor;
        }
        return inversifyfluentProvide(type)
            .whenTargetTagged(target.name, tagged)
            .done()
            .call(inversifyfluentProvide, target);
    }
    bindConstantValue(constantValue, serviceIdentifier, type, tagged) {
        if (!tagged) {
            tagged = DEFAULT_TAGGED;
        }
        return this.container
            .bind(serviceIdentifier)
            .toConstantValue(constantValue)
            .whenTargetTagged(type, tagged);
    }
    inject(id, type, tagged) {
        if (!tagged) {
            tagged = DEFAULT_TAGGED;
        }
        return (target, key, index) => {
            inversify_1.tagged(id, tagged)(target, key, index);
            inversify_1.inject(type)(target, key, index);
        };
    }
    lazyInject(id, type, tagged) {
        if (!tagged) {
            tagged = DEFAULT_TAGGED;
        }
        return (target, key) => {
            inversifyLazyInjectTagged(type, id, tagged)(target, key);
        };
    }
    get(serviceIdentifier, type, tagged) {
        if (!tagged) {
            tagged = DEFAULT_TAGGED;
        }
        return this.container
            .getTagged(type, serviceIdentifier, tagged);
    }
    getAll(type) {
        if (!type) {
            return INSTANCE_STORAGE;
        }
        return this.container
            .getAll(type);
    }
    merge(container) {
        this.container = inversify_1.Container.merge(this.container, container.container);
        return this;
    }
}
exports.default = Container;
