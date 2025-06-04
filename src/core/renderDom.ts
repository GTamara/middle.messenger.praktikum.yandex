import Block from './block';
import { EBlockEvents } from './types';

export default function renderDOM(block: Block) {
    const root = document.querySelector('#app');

  root!.innerHTML = '';
  root!.appendChild(block.getContent());
  block.eventBus.emit(EBlockEvents.FLOW_CDM);
}

export function render(query: string, block: Block) {
    const root = document.querySelector<HTMLElement>(query);

    // Можно завязаться на реализации вашего класса Block
    root?.appendChild(block.getContent());

    block.dispatchComponentDidMount();

    return root;
}
