from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

CONNECTION_STRING = "mongodb://localhost:27017/"
client = MongoClient(CONNECTION_STRING)
databaseName = client.instant_message

class ConnectionManager:

    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, username: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[username] = websocket

    async def activeList(self):
        return self.active_connections

    def disconnect(self, username):
        del self.active_connections[username]

    def getActive(self):
        return self.active_connections

    async def send_message(self, CHAT_ID: int, userName: str, message: str):
        chats = databaseName.chats
        jsonObject = {
            'type' : 'MESSAGE',
            'chatID' : CHAT_ID,
            'fromUser' : userName,
            'message': message
        }
        chat = chats.find_one({'chatID': CHAT_ID}, {'users': 1, '_id': 0})
        users = chat['users']
        for user in users:
            if user == userName:
                continue
            elif self.active_connections.get(user) != None:
                await self.active_connections[user].send_json(jsonObject)

def newUserCheck(userName: str, passWord: str):
   collName = databaseName.users
   result = list(collName.find({'username': userName}, {"_id": 0}))
   if result == []:
       newUser = {'username': userName, 'password': passWord, "chats": []}
       collName.insert_one(newUser)
       return True
   return False

def newChat(userList):
    if checkUser(userList) == False:
        return False
    usersUpdate  = databaseName.users
    chatUpdate = databaseName.chats
    chatID = autoNum()
    newChat = {"chatID": chatID, "users": userList}
    chatUpdate.insert_one(newChat)
    for x in userList:
        query = {"username": x}
        insert = {"$push": {"chats": chatID}}
        usersUpdate.update_one(query, insert)
    return chatID

def pushChat(newMessage, chatID, sender):
    logUpdate = databaseName.chatLog
    newLog = {'chatID': chatID, 'message': newMessage, 'sender': sender}
    logUpdate.insert_one(newLog)

def checkUser(userList):
    userChecker = databaseName.users
    for user in userList:
        query = {'username': user}
        result = userChecker.find_one(query, {'username': 1, "_id": 0})
        if result == None:
            return False

def autoNum():
    collName = databaseName.chats
    query = {"code": "counter"}
    result = collName.find_one(query, {"_id": 0})["counter"]
    result += 1
    insert = {"$set": {"counter": result}}
    collName.update_one(query, insert)
    return result

def loginVal(userName, passWord):
   collName = databaseName.users
   if(collName.find_one({'username': userName, 'password': passWord})):
      return True
   else:
      return False   

def getChatID(userName):
   collName = databaseName.users
   query = {"username": userName}
   result = collName.find_one(query, {"chats": 1, "_id": 0})["chats"]
   return result

def getChatHist(chatID: int):
    collName = databaseName.chatLog
    messageList = []
    result = list(collName.find({"chatID": chatID}, {"sender": 1, "message": 1, "_id": 0}))
    for x in result:
        messageList.append(f'{x["sender"]}: {x["message"]}')
    return messageList
