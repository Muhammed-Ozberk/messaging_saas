# Messaging SaaS

Messaging service available for web, mobile

## Getting Started

First, create a database on your computer and update the information in the database file in the config folder according to the database you created.
By default it is run as development mode. If you want to run it as production mode, you can change the environment variable in the .env file.

### Prerequisites

You need download and install the following requirements

```
NodeJS
```

```
MYSQL
```

### Installing

Then run the following commands in terminal one by one

```
npm install

```

```
npm start

```

## Running the tests

Open [http://localhost:8080](http://localhost:8080) in browser

## How to use

### Socket.io Middleware

It saves the incoming user ID first, then creates a jwt token and adds it to the socket object with its id value.

```
#Server
io.use((socket, next) =>{
    socket.userID = socket.handshake.query.userID; // User ID sent to us by Clint
    socket.token = socket.handshake.query.token; // Token sent to us by Clint
}
```

Sending a request to connect to socket.io with user id

```
#Client
        var socket = io({
		        query: {
              userID: "{{data.userID}}",
            }
        });
```

### Socket.io Joining the chat

The id value of the person to whom the message was sent is sent by clint. The id value of the logged in user is also taken from the socket object and processed in the backend, and the chat ids and messages of these users are returned. With this chat id, a separate area is created for these users with the socket.join function of socket.io. Then the other user is sent to join the chat.

```
#Server
.on("connection", async (socket) =>{
        console.log("A user connected");
        socket.on("join the chat", (data) => {
            var data = {
                        conversationID: conversationID,
                        messageData: messageData,
                        userID: socket.userID,
                        token: socket.token
                    }
            socket.join(data.conversationID); // Join the conversation room
            socket.emit("join the chat", data); // Send the conversation ID to the front end
            socket.to(data.conversationID).emit("is seen", { isSeen: true });
    }
```

The user who wants to send a message to the server side is sent. The information is processed and the chat id, messages, read receipt, token and user id value are returned with the on method.

```
#Client

        socket.emit('join the chat',{ receiverID: "{{data.receiverID}}"});

        socket.on('join the chat', (data) => {
            conversationID = data.conversationID;
            messages = data.messageData.messages;
            seenData = data.messageData.isSeen;
            userID = data.userID;
            token = data.token;
        });

        socket.on('is seen', (data) => {
            if(data.isSeen == true){
                seenData = true;
            }
        });
```

### Socket.io Sending a message

The message to be sent by the client and the chat id value are displayed. It is determined whether the other party is online or not. Accordingly, read receipt is returned as callback. Then, the message, from whom it was sent and the chat id value are sent to the next chat id value.

```
#Server

socket.on("send message", (data, callback) => { // Listen for new messages
        io.in(`${data.conversationID}`).fetchSockets().then((result) => {
            if (result.length != 2) {
                callback({ isSeen: false })
            } else {
                callback({ isSeen: true })
            }
        }).catch((err) => {
            console.log(err);
        });
        socket.to(data.conversationID).emit("receive message", { // Send the message to the other person in the conversation
            from: socket.userID, // The person who sent the message
            message: data.message, // The message content
            conversationID: data.conversationID // The conversation the message is in
        });
    }

```

Message and chat id value is sent to the server side. Then, with the on method, the message, who it came from and the chat id value are captured.

```
#Client

        socket.emit('send message', { message: message, conversationID: conversationID }, (data) => {
                if(data.isSeen == false){
                    seenData = false;
                }
        });
        socket.on('receive message', (data) => {
            seenData = data.isSeen;
            messages.push(data);
        });
```

## Acknowledgments

