import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:8080")
ws.on("open",()=>{
    console.log("Aberto")
})

ws.on("message",mes=>{
    const parsed = mes.toString("utf-8").split("|")
    console.log(parsed)
    switch(parsed[0]) {
        case "ident":
            ws.send("ident|0")
            break;
        
    }
})