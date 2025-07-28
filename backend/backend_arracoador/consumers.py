from channels.generic.websocket import AsyncWebsocketConsumer
from rich.console import Console

console = Console()

class ArracoadorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        console.print("[bold green]✅ Cliente conectado ao WebSocket![/bold green]")
        await self.send(text_data="ident|0")  # envia mensagem inicial para o app

    async def disconnect(self, close_code):
        console.print(f"[bold red]❌ Cliente desconectado! Código: {close_code}[/bold red]")

    async def receive(self, text_data):
        console.print(f"[bold cyan]📨 Mensagem recebida:[/bold cyan] {text_data}")

        if text_data.startswith("ident|"):
            await self.send(text_data="connect|ok")
            console.print("[bold green]✅ Resposta enviada: connect|ok[/bold green]")

        elif text_data.startswith("dstat|"):
            await self.send(text_data="stat|ok")
            console.print("[bold green]📊 Resposta enviada: stat|ok[/bold green]")

        elif text_data.startswith("stat_ack"):
            console.print("[yellow]⚙️  Acknowledgment recebido.[/yellow]")

        elif text_data.startswith("disconnect"):
            await self.send(text_data="disconnect|0")
            console.print("[bold red]🔌 Cliente solicitou desconexão![/bold red]")

        else:
            await self.send(text_data="msg|erro_comando")
            console.print("[red]❌ Comando não reconhecido![/red]")
