#!/usr/bin/env python
from PIL import Image
import pytesseract
import pymongo
import re
from bson import objectid

# listImg = ("10A", "10B", "10C", "7A", "7B", "7C", "8A", "8B", "8C", "9A", "9B", "9C")
listImg = ("1A", "1B", "2A", "2B", "2C", "3A", "3B", "3C", "4A", "4B", "4C", "5A", "5B", "5C", "6A", "6B", "6C")
# listImg = ("7A", "7B")

# myclient = pymongo.MongoClient("mongodb://soda:dev@134.41.203.87:57017/soda")
myclient = pymongo.MongoClient("mongodb://soda:dev@naruto:57017/soda")
mydb = myclient["soda"]
mycol = mydb["students"]
allStudents = []
# pattern = re.compile('^[a-z ]+$', re.IGNORECASE)
# noneOfThese = re.compile(
#     'TOTAL|HOMBRES|MUJERES| *Colegio *Saint *Francis| *LISTA *DE *CLASE|PROFESORA *GUIA:*|/feb/', re.IGNORECASE)
# for img in listImg:
#     print(img + "this is image")
#     listArray = pytesseract.image_to_string(Image.open("./list-png/" + img + ".png"), lang='eng')
#     lines = listArray.splitlines()
#     for l in lines:
#         l = l.strip()
#         l = re.sub(r"\d|\.|-|\[|`|\(|\)|_|‘|'|’", "", l)
#         if len(l) > 2 and pattern.match(l) and not noneOfThese.match(l):
#             names = l.lower().split()
#             howmany = len(names)
#             student = None
#             if howmany == 2:
#                 student = {
#                     "_id": str(objectid.ObjectId()),
#                     "grade": img,
#                     "name": names[0],
#                     "middle": names[1]
#                 }
#             elif howmany == 3:
#                 student = {
#                     "_id": str(objectid.ObjectId()),
#                     "grade": img,
#                     "name": names[0],
#                     "middle": names[1],
#                     "last1": names[2]
#                 }
#             elif howmany == 4:
#                 student = {
#                     "_id": str(objectid.ObjectId()),
#                     "grade": img,
#                     "name": names[0],
#                     "middle": names[1],
#                     "last1": names[2],
#                     "last2": names[3]
#                 }
#             elif howmany > 4:
#                 print('this student has to be added manually')
#                 print(names, img)

#             if isinstance(student, dict):
#                 allStudents.append(student)

# allStudents.append({
#     "_id": str(objectid.ObjectId()),
#     "grade": "10A",
#     "name": "lan huang",
#     "middle": "jessica",
#     "last1": "yeu",
#     "last2": "huey"
# })

# allStudents.append({
#     "_id": str(objectid.ObjectId()),
#     "grade": "10A",
#     "name": "vindas",
#     "middle": "ferrer",
#     "last1": "antonio",
#     "last2": "de jesus"
# })

# allStudents.append({
#     "_id": str(objectid.ObjectId()),
#     "grade": "7B",
#     "name": "villegas",
#     "middle": "mata",
#     "last1": "daniel"
# })

# allStudents.append({
#     "_id": str(objectid.ObjectId()),
#     "grade": "7C",
#     "name": "alvarez",
#     "middle": "rojas",
#     "last1": "lucia",
#     "last2": "de los angeles"
# })

# allStudents.append({
#     "_id": str(objectid.ObjectId()),
#     "grade": "8B",
#     "name": "solano",
#     "middle": "brenes",
#     "last1": "sofia",
#     "last2": "del carmen"
# })

# allStudents.append({
#     "_id": str(objectid.ObjectId()),
#     "grade": "9C",
#     "name": "hernandez",
#     "middle": "vega",
#     "last1": "rebeca",
#     "last2": "de guadalupe"
# })

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "9B",
    "name": "cen",
    "middle": "wang",
    "last1": "xiao",
    "last2": "wen (wendy)"
})

mycol.insert_many(allStudents)
# mycol.update_one({"grade": "10B", "middle": "samuels", "last1": "zuriann"}, {"$set": {"name": "muir"}})
# mycol.update_one({"grade": "7A", "middle": "jimenez", "last1": "daniela"}, {"$set": {"name": "granados"}})
# mycol.update_one({"grade": "7B", "name": "phillips", "middle": "mojica"}, {"$set": {"last1": "emma", "last2": "sofia"}})
# mycol.delete_one({"grade": "7B", "name": "m", "middle": "uj", "last1": "eres"})
