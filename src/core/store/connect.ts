import type { Indexed } from '../../shared/types';
import { EStoreEvents } from '../event-bus/types';

// Базовый интерфейс для компонента
export interface IConnectableComponent<P extends Indexed> {
    setProps: (newProps: Partial<P>) => void;
    componentWillUnmount?(): void;
}

// Тип конструктора компонента
export type ConnectableComponentConstructor<P extends Indexed = Indexed> = {
    new(...args: any[]): IConnectableComponent<P>;
};

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
    return function(Component: any) {
        // используем class expression
        return class extends Component {
            constructor(props: any) {
                const store = window.store;
                super({ ...props, ...mapStateToProps(store.getState()) });

                // подписываемся на событие
                store.on(EStoreEvents.UPDATED, () => {
                    // вызываем обновление компонента, передав данные из хранилища
                    this.setProps({ ...mapStateToProps(store.getState()) });
                });
            }
        };
    };
}
