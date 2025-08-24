from rich.console import Console

def show_server_banner():
    console = Console()

    ascii_logo = r"""
          _____                    _____          
         /\    \                  /\    \         
        /::\____\                /::\    \        
       /::::|   |               /::::\    \       
      /:::::|   |              /::::::\    \      
     /::::::|   |             /:::/\:::\    \     
    /:::/|::|   |            /:::/  \:::\    \    
   /:::/ |::|   |           /:::/    \:::\    \   
  /:::/  |::|___|______    /:::/    / \:::\    \  
 /:::/   |::::::::\    \  /:::/    /   \:::\    \ 
/:::/    |:::::::::\____\/:::/____/     \:::\____\
\::/    / ~~~~~/:::/    /\:::\    \      \::/    /
 \/____/      /:::/    /  \:::\    \      \/____/ 
             /:::/    /    \:::\    \             
            /:::/    /      \:::\    \            
           /:::/    /        \:::\    \           
          /:::/    /          \:::\    \          
         /:::/    /            \:::\    \         
        /:::/    /              \:::\____\        
        \::/    /                \::/    /        
         \/____/                  \/____/         
                                                          
    """

    console.print(ascii_logo, style="bold cyan")
    console.print("[bold cyan]🐠 Alimentador CSC - WebSocket Server 🐠[/bold cyan]")
    console.print("[bold green]⚙️  Status:[/bold green] Ativo e ouvindo conexões...")
    console.print("[bold yellow]Autor:[/bold yellow] Os manos do CSC 😎")
    console.print("[bold magenta]🚀 React Native + Django Channels[/bold magenta]")
