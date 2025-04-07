from fastapi import WebSocket

class Manager:
    def __init__(self):
        self.connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.connections.remove(websocket)

    async def send_json(self, message: str, websocket: WebSocket):
        await websocket.send_json(message)

manager = Manager()