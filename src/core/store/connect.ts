import type { Indexed } from '../../shared/types';
import isEqual from '../../shared/utils/is-equal';
import { EStoreEvents } from '../event-bus/types';

// Базовый интерфейс для компонента
export interface IConnectableComponent<P extends Indexed> {
    setProps: (newProps: Partial<P>) => void;
    componentWillUnmount?(): void;
}

// Тип конструктора компонента
export type ConnectableComponentConstructor<P extends Indexed = Indexed> = {
    new (...args: any[]): IConnectableComponent<P>;
};

export function connect<P extends Indexed>(mapStateToProps: (state: Indexed) => Partial<P>) {
    return function <T extends ConnectableComponentConstructor<P>>(Component: T) {
        // Создаем именованный класс
        class ConnectedComponent extends Component {
            private onChangeStoreCallback: () => void;

            constructor(...args: any[]) {
                const [ props ] = args;
                const store = window.store;
                const state = mapStateToProps(store.getState());

                super({ ...props, ...state });

                this.onChangeStoreCallback = () => {
                    const newState = mapStateToProps(store.getState());
                    if (!isEqual(state, newState)) {
                        this.setProps({ ...newState });
                    }
                };

                store.on(EStoreEvents.UPDATED, this.onChangeStoreCallback);
            }

            componentWillUnmount() {
                super.componentWillUnmount?.();
                window.store.off(EStoreEvents.UPDATED, this.onChangeStoreCallback);
            }
        }

        return ConnectedComponent;
    };
}
