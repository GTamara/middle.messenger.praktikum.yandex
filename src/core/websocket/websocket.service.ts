import { WS_CHAT_URL } from '../../app-config';
import { ChatApiService } from '../../pages/chat/services/chat-api.service';
import type EventBus from '../event-bus/event-bus';
import { EChatMessagesEvents } from '../event-bus/types';
import type { WebsocketConnectionData } from './types';

export class WebsocketService {
    private static __instance: WebsocketService | null = null;
    static __ws: WebSocket | null = null;
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;
    private readonly reconnectDelay: number = 3000; // 3 seconds
    private readonly websocketMessagesEventBus: EventBus<EChatMessagesEvents> = window.websocketMessagesEventBus;
    private api = new ChatApiService();

    constructor(
        private userId: number,
        private chatId: number,
        private onOpenCallback?: () => void,
    ) {
        this.initSocket();
        this.subscribeToEvents();
    }

    // Получаем или создаем экземпляр Singleton
    public static getInstance(
        userId?: number,
        chatId?: number,
        onOpenCallback?: () => void,
    ): WebsocketService {
        if (!WebsocketService.__instance && userId && chatId) {
            WebsocketService.__instance = new WebsocketService(userId, chatId, onOpenCallback);
        } else if (userId && chatId && WebsocketService.__instance) {
            // Обновляем соединение, если переданы новые параметры
            WebsocketService.__instance.updateConnection(userId, chatId);
        }
        return WebsocketService.__instance!;
    }

    // Закрываем соединение и очищаем Singleton
    public static destroyInstance(): void {
        if (WebsocketService.__instance) {
            WebsocketService.__instance.closeConnection();
            WebsocketService.__instance = null;
        }
    }

    private updateConnection(userId: number, chatId: number): void {
        this.userId = userId;
        this.chatId = chatId;
        this.updateWebsocketConnection();
    }

    // Подписываемся на событие смены чата
    private subscribeToEvents() {
        this.websocketMessagesEventBus.on(
            EChatMessagesEvents.SHOULD_INITIATE_NEW_WEBSOCKET_CONNECTION,
            (data: WebsocketConnectionData) => {
                if (data.userId && data.chatId) {
                    this.userId = data.userId;
                    this.chatId = data.chatId;
                    this.updateWebsocketConnection(); // Закрываем старое соединение и открываем новое
                }
            },
        );
    }

    getWebSocketToken(chatId: number) {
        return this.api.getWebsocketChatToken(chatId);
    }

    private async initSocket(): Promise<void> {
        try {
            const websocketChatTokenResponse = await this.api.getWebsocketChatToken(this.chatId);
            const token = websocketChatTokenResponse.token;
            WebsocketService.__ws = new WebSocket(
                `${WS_CHAT_URL}${this.userId}/${this.chatId}/${token}`,
            );

            this.setupEventListeners();
            this.websocketMessagesEventBus.emit(EChatMessagesEvents.MESSAGE_NEW_CONNECTION_ESTABLISHED);
        } catch (e) {
            console.error(e);
        }
    }

    updateWebsocketConnection() {
        this.closeConnection();
        this.initSocket();
    }

    setupEventListeners() {
        if (!WebsocketService.__ws) return;
        const ws = WebsocketService.__ws;

        ws.addEventListener('open', () => {
            console.log('WebSocket connection established');
            this.reconnectAttempts = 0; // Сброс счетчика переподключений

            this.websocketMessagesEventBus.emit(EChatMessagesEvents.WEBSOCKET_CONNECTION_OPENED);
            this.onOpenCallback?.();
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
            this.websocketMessagesEventBus.emit(EChatMessagesEvents.MESSAGE_RECEIVED, event.data);
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
        if (WebsocketService.__ws) {
            WebsocketService.__ws.close();
            WebsocketService.__ws = null;
        }
    }

    static sendMessage(content: string, type = 'message'): void {
        if (WebsocketService.__ws && WebsocketService.__ws.readyState === WebSocket.OPEN) {
            WebsocketService.__ws.send(JSON.stringify({
                content,
                type,
            }));
        } else {
            console.error('WebSocket is not connected');
            // Можно добавить очередь сообщений или попытку переподключения
        }
    }
}
