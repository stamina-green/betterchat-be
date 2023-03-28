import * as http from 'http';
let servers = [{
    users: ["123", "8782184"],
    messages: [{
        author: "123",
        message: "cus"
    },
    {
        author: "SYSTEM",
        message: "BS"
    }]
}]

const server = http.createServer(async (req, res) => {
    console.log(req.url);
    const [path, query] = req.url.split("?")
    res.setHeader("Access-Control-Allow-Origin", "*")
    switch (path) {
        case "/createchat":
            let [user1Id, user2Id] = query.split(";")
            servers.push({
                users: [user1Id, user2Id],
                messages: [{ author: "SYSTEM", message: "Chat created" }]
            })
            res.end('ok')
            break;
        case "/getmessages":
            let [reqUser, usertwo] = query.split(";")
            const chat = servers.find(server => server.users.includes(reqUser) && server.users.includes(usertwo))
            res.end(chat.messages.map((message) => `${message.author}¨${message.message}`).join("`"))
            console.log(chat.messages);
            break;
        case "/newmessage":
            const [user2, msg, author] = query.split(";")
            let message = msg
            while (message.includes("%20")) {
                message = message.replace("%20", " ")
                console.log(message);
            }
            const chat2 = servers.find(server => server.users.includes(user2) && server.users.includes(author))
            chat2.messages.push({ author: author, message: message })

            res.end("ok, bye")
            break;
        case "/getchats":
            let requestUser = query
            const chats = servers.filter(server => server.users.includes(requestUser))
            res.end((chats.map(chat => chat.users.find(user => user !== requestUser))).join(","))
            break;
        default:
            res.end("/ not implemented")
            break;
    }
}).listen(8182)

const generateServer = () => {
    const newRandomNumber = Math.round(Math.random() * 10e24)
    const randomString = Buffer.from(newRandomNumber.toString())
    let id = randomString.toString('base64');
    id = id.substring(5, 8)
    id = id.toLowerCase()
    if (servers[id]) return generateServer()
    servers[id] = [["SYSTEM", "Chat created"]]
    return id.toLowerCase()
}

for (let i = 0; i < 100; i++) {
    console.log(generateServer());

}


generateServer()

