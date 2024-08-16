from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from connectionMan import ConnectionManager, loginVal, getChatID, getChatHist, newUserCheck, newChat, pushChat
from pydantic import BaseModel

app = FastAPI()

class userList(BaseModel):
    users: list

class newMessage(BaseModel):
    message: str
    chatID: int
    sender: str

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

counter = 0

manager = ConnectionManager()

@app.websocket("/ws/{userName}")
async def websocket_endpoint(userName: str, websocket: WebSocket):
    print("connection established. username is:" + userName)
    await manager.connect(userName, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            chatID = int(data['chatID'])
            sender = data['sender']
            message = data['message']
            pushChat(message, chatID, sender)
            await manager.send_message(chatID, sender, message)
    except Exception as WebsocketDisconnect:
        manager.disconnect(userName)

@app.post('/newChat/')
async def createChat(user: userList):
    userList = user.users
    print(userList)
    return newChat(userList)

@app.get('/fetchHist/{chatID}')
async def getHist(chatID: int):
    return getChatHist(chatID)

@app.get('/fetchChats/{userName}')
async def getChats(userName):
    return getChatID(userName)

@app.post('/pushChat')
async def pushChats(message: newMessage):
    newMessage = message.message
    chatID = message.chatID
    sender = message.sender
    pushChat(newMessage, chatID, sender)

@app.get('/createUser/{loginAttempt}')
async def createUser(loginAttempt):
    logList = loginAttempt.split("-")
    userName = logList[0]
    passWord = logList[1]
    return newUserCheck(userName, passWord)

@app.get('/login/{loginAttempt}')
async def login(loginAttempt):
    logList = loginAttempt.split('-')
    userName = logList[0]
    passWord = logList[1]
    if loginVal(userName, passWord):
        print("true!")
        return True
    else:
        return False

@app.websocket("/checkActive")
async def checkActive():
    return manager.getActive()

