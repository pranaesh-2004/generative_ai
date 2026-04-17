from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]

feedback_collection = db["feedback"]
subject_report_collection = db["subject_reports"]