from channels.generic.websocket import AsyncWebsocketConsumer
from rich.console import Console
import json

console = Console()

class ArracoadorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        console.print("[bold green]✅ Cliente conectado ao WebSocket![/bold green]")

    async def disconnect(self, close_code):
        console.print(f"[bold red]❌ Cliente desconectado! Código: {close_code}[/bold red]")

    async def receive(self, text_data):
        console.print(f"[bold cyan]📨 Mensagem recebida:[/bold cyan] {text_data}")

        # Exemplo: Ecoa a mensagem de volta
        await self.send(text_data=json.dumps({
            'message': 'Mensagem recebida com sucesso! 🎯'
        }))
        console.print("[bold green]✅ Mensagem enviada de volta ao cliente![/bold green]")