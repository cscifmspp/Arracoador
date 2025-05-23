/*

    Servidor WebSocket do arraçoador
    -Matheus

    (cliente pode ser tando o app controlador ou o próprio esp que controla o arraçoador)
    
    Início da conexão (É NECESSÁRIO FAZER ESTE PASSO SE NÃO O SERVIDOR NÃO ACEITA)
    -------------------------------------------------------
    | Cliente                                    Servidor |
    |-----------------------------------------------------|
    |                                                     |
    |    *Conexão iniciada*    ->                         |
    |                          <-          ident          |           
    |       ident|<tipo>       ->                         |    tipo é 0 se for arraçoador, 1 se for o app
    |                          <-        ident_ack        |
    |                                                     |
    |  *servidor manda para outros dashboards conectados* |
    |                                                     |
    |                          <- connect|<id arraçoador> |
    |        connect_ack       ->                         |
    |                                                     |
    -------------------------------------------------------
    
    
    Arraçoador manda dados
    -------------------------------------------------------------------------------------------------
    | Cliente                                                                              Servidor |
    |-----------------------------------------------------------------------------------------------|
    |                                                                                               |
    | astat|<peso>|<próxima ativação>|<servo ativo> ->                                              |    peso em miligramas, próxima ativação é o rtc.now() em que o servo vai ativar, servo ativo é 0 se o servo da rosca sem fim estiver desligado e 1 se estiver ligado 
    |                                                                                               |
    |                     *agora o servidor manda para todos os clients "dashboard"*                |
    |                                                                                               |
    |                                               <- stat|<peso>|<próxima ativação>|<servo ativo> |           
    |                   stat_ack                    ->                                              |
    |                                                                                               |
    |                                   *de volta pro arraçoador*                                   |
    |                                                                                               |
    |                                               <-                stat_ack                      |    
    |                                                                                               |
    -------------------------------------------------------------------------------------------------
    
    
    Dashboard pede dados
    -----------------------------------------------------
    | Cliente                                  Servidor |
    |---------------------------------------------------|
    |                                                   |
    |  dstat|<id arraçoador>  ->                        |
    |                         <- stat|<peso>|<blablabl> |   o mesmo dali de cima ó ^^^^^^^^^^^^
    |       stat_ack          ->                        |
    |                                                   |
    -----------------------------------------------------
    
    Dashboard ativar/desativar servo do arraçoador
    ---------------------------------------------------------------------------
    | Cliente                                                        Servidor |
    |-------------------------------------------------------------------------|
    |                                                                         | (ou feedstop)
    |       feedstart|<id>                                    ->              | *ESCOLHA APENAS 1 DESSES TRÊS*
    |       feedstart|<id>|0|<quantidade de ração em gramas>  ->              |
    |       feedstart|<id>|1|<tempo de ativação em ms>        ->              |
    |                                                                         |
    |                                *arraçoador*                             |
    |       <- feed|<blablabla a mesma coisa que ali em cima só que sem o id> |  
    |                        *arraçoador ativa o servo*                       |
    |                feed_ack                                 ->              |
    |                                                                         | 
    ---------------------------------------------------------------------------
    (eu não sei fazer documentação jesus amado)
    
    */


import jsonwebtoken from "jsonwebtoken";
import e from "express";
import expressWs from "express-ws";
import WebSocket, {WebSocketServer} from "ws";
const app = e()

const usuario = {
    nome: "padeirinho games",
    cpf: "42165518822",
}

const expiresIn = "1m"

const CHAVE_PRIVADA = "kasanetetogaming0401"

function validarToken(req,res,next) {
    if(!req.headers.authorization) return res.status(401).send("Acesso negado. Nenhum token providenciado");
    const [,token] = req.headers.authorization?.split(" ");
    if(!token) return res.status(401).send("Acesso negado. Nenhum token providenciado");
    try {
        const payload = jsonwebtoken.verify(token,CHAVE_PRIVADA)
        const usuariodotoken = typeof payload !== "string" && payload.user;
        if(!usuariodotoken) {
            return res.status(401).send("Acesso negado. Usuário inválido.")
        }
        req.headers["user"] = payload.user
        return next()
    } catch (e) {
        console.error(e)
        return res.status(500).send("Erro interno, tente novamente mais tarde. Caso o erro persista, entre em contato com o suporte.")
    }
}

expressWs(app);
app.use(e.json());
app.get("/",(req,res)=>{
    return res.send("xd")
})

app.get("/login",(req,res)=>{
    const [, hash] = req.headers.authorization?.split(" ") || [" ", " "];
    const [cpf,senha] = Buffer.from(hash,"base64").toString().split(":");
    try {
        const correto = cpf == usuario.cpf && senha == "pinto";
        if(!correto) return res.status(401).send("CPF ou senha incorreta.")
        const token = jsonwebtoken.sign({user: JSON.stringify(usuario)}, CHAVE_PRIVADA, {expiresIn});
        return res.send({data:{usuario,token,expiresIn}});
    } catch(e) {
        console.error(e)
        return res.status(500).send("Erro interno, tente novamente mais tarde. Caso o erro persista, entre em contato com o suporte.")
    }
})
app.use(validarToken)


app.get("/protegido",(req,res)=>{
    const {user} = req.headers;
    return res.send(JSON.parse(user))
})

app.listen(80,()=>{console.log("aberto")})

const validateClient = n => !isNaN(n) || n > 0 || n < clients.length

const wss = new WebSocketServer({port:8080});
wss.devices = []
wss.on("connection",wsc=>{
    wsc.vivo = true;
    wsc.send("ident");
    wsc.on("pong",function(){
        this.vivo = true;
    })
    wsc.on("message",mes=>{
        const parsed = mes.toString("utf-8").split(/\|/gm);
        if(parsed.length == 0) return wsc.send("invalid msg");
        if(!wsc.deviceInfo && parsed[0] != "ident") return wsc.send("ident");
        switch(parsed[0]){
            case "ident":
                // ident|<tipo de dispositivo == 0 ? "arracoador" : "dashboard"
                if(parsed.length != 2 || isNaN(Number(parsed[1])) || !([0,1]).includes(Number(parsed[1]))) {
                    wsc.send("invalid device type");
                    wsc.close();
                    return;
                }
                wsc.deviceInfo = {};
                wsc.deviceInfo.type = parsed[1] == 0 ? "arracoador" : "dashboard";
                wsc.deviceIdx = wss.devices.length;
                wsc.send("ident_ack");
                wss.devices.push(wsc);
                for(const client of wss.devices) {
                    if(client.deviceInfo.type == "dashboard") client.send(`connect|${wsc.deviceIdx}`)
                }
                break;
            case "astat":
                //astat|<peso lido>|<tempo da proxima alimentação>|<servo ligado>
                if(wsc.deviceInfo.type !== "arracoador") return wsc.send("guhhhhh");
                const peso = Number(parsed[1]);
                if(isNaN(peso)) return wsc.send("peso inválido");
                const rtc = Number(parsed[2]);
                if(isNaN(rtc)) return wsc.send("tempo inválido");
                const alimentando = Number(parsed[3]);
                if(isNaN(alimentando) || !([0,1].includes(alimentando))) return wsc.send("bobo");
                wsc.deviceInfo = {
                    "type":"arracoador",
                    peso,rtc,alimentando
                };
                for(const client of wss.devices) {
                    if(client.deviceInfo.type == "dashboard") {
                        client.send(`stat|${peso}|${rtc}|${alimentando}`);
                    };
                };
                arracoador.send("stat_ack");
                break;
            case "dstat":
                //dstat|<idx do arracoador>
                if(wsc.deviceInfo.type !== "dashboard") return wsc.send("guhhhhh");
                const dashboardIdx = Number(parsed[1]) //é o que tem pra hoje
                if(!validateClient(dashboardIdx) || wss.devices[dashboardIdx].deviceInfo.type != "arracoador") return wsc.send("bobalhão");
                const a = wss.devices[dashboardIdx];
                wsc.send(`stat_ans|${a.deviceInfo.peso ?? "null"}|${a.deviceInfo.rtc ?? "null"}|${a.deviceInfo.alimentando ?? "null"}`);
                break;
            case "feedstart":
                if(wsc.deviceInfo.type !== "dashboard") return wsc.send("nuh uh");
                const yeah = Number(parsed[1]);
                if(!validateClient(yeah) || wss.devices[yeah].deviceInfo.type != "arracoador") return wsc.send("device idx out of range");
                /*
                    feed|<idx do dispositivo>
                    feed|<idx do dispositivo>|0|<quantidade de ração em gramas>
                    feed|<idx do dispositivo>|1|<duração de atuação do servo em ms>
                */
                return wss.devices[yeah].send(`feed${parsed.length == 4 ? "|" + parsed.slice(2).join("|"): ""}`);
                break;
            case "feedstop":
                if(wsc.deviceInfo.type !== "dashboard") return wsc.send("nuh uh");
                const yeah2 = Number(parsed[1]);
                if(!validateClient(yeah2) || wss.devices[yeah2].deviceInfo.type != "arracoador") return wsc.send("device idx out of range");
                wss.devices[yeah2].send("feedstop");
                break;
        }
    });
    wsc.on("close",()=>{
        for(const client of wss.devices) {
            if(client.deviceInfo && client.deviceInfo.type == "dashboard") {
                client.send("disconnect|"+client.deviceIdx ?? "-1")
            }
        }
    });
});
const interval = setInterval(function ping() {
    wss.devices.forEach(function each(ws) {
        if (ws.vivo === false) {
            if(ws.deviceInfo && ws.deviceInfo.type == "arracoador") {
                for(const client of wss.devices) {
                    if(client.deviceInfo && client.deviceInfo.type == "dashboard") {
                        client.send("timeout|"+client.deviceIdx ?? "-1")
                    }
                }
            }
            return ws.terminate()
        };
        ws.vivo = false;
        ws.ping();
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});