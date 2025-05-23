from rich.console import Console
from rich.panel import Panel

def show_server_banner():
    console = Console()
    console.print(Panel.fit(
        "[bold cyan]🐠 Alimentador CSC - WebSocket Server 🐠[/bold cyan]\n"
        "[bold green]⚙️  Status:[/bold green] Ativo e ouvindo conexões...\n"
        "[bold yellow]Autor:[/bold yellow] Os manos do CSC😎",
        title="[bold magenta]Servidor Iniciado[/bold magenta]",
        subtitle="🚀 React Native + Django Channels",
    ))
