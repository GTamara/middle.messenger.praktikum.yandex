import { WS_CHAT_URL } from '../../../app-config';
import EventBus from '../../../core/event-bus/event-bus';
import { EChatEvents } from '../../../core/event-bus/types';
import { ChatApiService } from './chat-api.service';

export class ChatWebsocketService {
    private ws: WebSocket | null = null;
    private readonly api: ChatApiService = new ChatApiService();
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;
    private readonly reconnectDelay: number = 3000; // 3 seconds
    eventBus: EventBus<EChatEvents>;

    constructor(
        private readonly iserId: number,
        private readonly chatId: number,
    ) {
        this.initSocket();
        this.eventBus = new EventBus();
    }

    getWebSocketToken(chatId: number) {
        return this.api.getWebsocketChatToken(chatId);
    }

    private async initSocket(): Promise<void> {
        console.log('initSocket');
        try {
            const websocketChatTokenResponse = await this.api.getWebsocketChatToken(this.chatId);
            const token = websocketChatTokenResponse.token;
            this.ws = new WebSocket(
                `${WS_CHAT_URL}${this.iserId}/${this.chatId}/${token}`,
            );
            this.setupEventListeners();
        } catch (e) {
            console.error(e);
        }
    }

    setupEventListeners() {
        if (!this.ws) return;
        const ws = this.ws;

        ws.addEventListener('open', () => {
            console.log('WebSocket connection established');
            this.reconnectAttempts = 0; // Сброс счетчика переподключений

            ws.send(JSON.stringify({
                content: 'Моё первое сообщение миру!',
                type: 'message',
            }));
        });

        ws.addEventListener('close', (event) => {
            if (event.wasClean) {
                console.log('WebSocket connection closed cleanly');
            } else {
                console.log('WebSocket connection abruptly closed');
                this.attemptReconnect();
            }

            console.log(`Code: ${event.code} | Reason: ${event.reason}`);
        });

        ws.addEventListener('message', (event) => {
            console.log('Received message:', event.data);
            this.eventBus.emit(EChatEvents.MESSAGE_RECEIVED, event.data);
        });

        ws.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            this.attemptReconnect();
            this.reconnectAttempts++;
        });
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

        setTimeout(() => {
            this.initSocket();
        }, this.reconnectDelay);
    }

    closeConnection(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    sendMessage(content: string): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                content,
                type: 'message',
            }));
        } else {
            console.error('WebSocket is not connected');
            // Можно добавить очередь сообщений или попытку переподключения
        }
    }
}
