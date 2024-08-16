from pymongo import MongoClient

def query_db(userName, passWord):

   CONNECTION_STRING = "mongodb://localhost:27017/"

   client = MongoClient(CONNECTION_STRING)
 
   databaseName = client.names

   
   collName = databaseName.sample_info

   if(collName.find_one({'userName': userName, 'password': passWord})):
      return True
   else:
      return False