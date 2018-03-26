import { interfaces as inversifyInterfaces } from 'inversify';
export default class Container {
    container: inversifyInterfaces.Container;
    bind<T>(target: inversifyInterfaces.Newable<T>, type: symbol | string, tagged?: any): T;
    bindConstantValue(constantValue: {}, serviceIdentifier: string | symbol | inversifyInterfaces.Newable<{}> | inversifyInterfaces.Abstract<{}>, type: string | number | symbol, tagged?: any): inversifyInterfaces.BindingOnSyntax<any>;
    inject(id: string | symbol, type: string | symbol, tagged?: any): (target: any, key: string, index?: number) => void;
    lazyInject(id: string, type: string | symbol, tagged?: any): (target: any, key: string) => void;
    get<T>(serviceIdentifier: string | number | symbol, type: string | symbol | inversifyInterfaces.Newable<T> | inversifyInterfaces.Abstract<T>, tagged?: any): T;
    getAll<T>(type?: string | symbol): T[];
    merge(container: Container): Container;
}
