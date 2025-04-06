import {tokenService} from '@shared/lib/tokenService/tokenService.ts';

type Listener = () => void;
type MessageListener = (msg: any) => void;

class ChatWebSocket {
	private socket: WebSocket | null = null;
	private onConnectListeners: Listener[] = [];
	private onDisconnectListeners: Listener[] = [];
	private onMessageListeners: MessageListener[] = [];

	connect(): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			console.log('[Chat WS] Already connected');
			return;
		}

		this.socket = new WebSocket('wss://crocodailo.ru/ws/plan/');

		this.socket.onopen = () => {
			console.log('[Chat WS] Connected');
			this.onConnectListeners.forEach((fn) => fn());
		};

		this.socket.onclose = (event) => {
			console.log('[Chat WS] Disconnected. Code:', event.code, 'Reason:', event.reason);
			this.onDisconnectListeners.forEach((fn) => fn());
		};

		this.socket.onerror = (error) => {
			console.error('[Chat WS] Error:', error);
		};

		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			this.onMessageListeners.forEach((fn) => fn(data));
		};
	}

	sendMessage(message: Record<string, any>): void {
		const token = tokenService.getAccessToken();

		const payload = {
			...message,
			access: token,
		};

		if (this.socket?.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(payload));
		} else {
			console.warn('[Chat WS] Not connected');
		}
	}

	onMessage(callback: MessageListener): void {
		this.onMessageListeners.push(callback);
	}

	onConnect(callback: Listener): void {
		this.onConnectListeners.push(callback);
	}

	onDisconnect(callback: Listener): void {
		this.onDisconnectListeners.push(callback);
	}

	disconnect(): void {
		if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) {
			this.socket.close();
		}
		this.socket = null;
	}

	getSocket(): WebSocket | null {
		return this.socket;
	}
}

export const chatSocket = new ChatWebSocket();
