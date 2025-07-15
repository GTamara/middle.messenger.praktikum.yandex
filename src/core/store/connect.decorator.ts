import type { Indexed } from '../../shared/types';
import { EStoreEvents } from '../event-bus/types';

// Базовый интерфейс для компонента
export interface IConnectableComponent<P = unknown> {
    setProps: (newProps: Partial<P>) => void;
}

// Тип конструктора компонента
export type ConnectableComponentConstructor<P extends Indexed = Indexed> = {
    new(...args: unknown[]): IConnectableComponent<P>;
};

export function Connect<P extends Indexed>(mapStateToProps: (state: Indexed) => Partial<P>) {
    return function<T extends new(...args: any[]) => IConnectableComponent<P>>(Component: T) {
        // используем class expression
        return class extends Component {
            constructor(...args: any[]) {
                const store = window.store;
                const props = args[0] || {};
                super({ ...props, ...mapStateToProps(store.getState()) });

                // подписываемся на событие
                store.on(EStoreEvents.STORE_UPDATED, () => {
                    // вызываем обновление компонента, передав данные из хранилища
                    this.setProps({ ...mapStateToProps(store.getState()) });
                });
            }
        };
    };
}
