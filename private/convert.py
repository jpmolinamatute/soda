#!/usr/bin/env python
from PIL import Image
import pytesseract
import pymongo
import re
from bson import objectid

listImg = ("10A", "10B", "10C", "11A", "11B", "11C", "7B", "7C", "8A", "8B", "8C", "7A", "9A", "9B", "9C", "1A", "1B",
           "1C", "2A", "2B", "3A", "3B", "3C", "4A", "4B", "4C", "5A", "5B", "5C", "6A", "6B", "6C", "KA", "KB", "PB",
           "PC", "PKB")

myclient = pymongo.MongoClient("mongodb://soda:dev@naruto:57017/soda")
mydb = myclient["soda"]
mycol = mydb["students"]
allStudents = []
pattern = re.compile('^[a-záéíóúñ ]+$', re.IGNORECASE)
noneOfThese = re.compile(
    'TOTAL|HOMBRES|MUJERES| *Colegio *Saint *Francis| *LISTA *DE *CLASE|PROFESORA *GUIA:*| IDENTIFICACIÓN ', re.IGNORECASE)

for img in listImg:
    listArray = pytesseract.image_to_string(
        Image.open("./list-png/" + img + ".png"), lang='spa')
    lines = listArray.splitlines()
    for singleLine in lines:
        singleLine = singleLine.strip()
        singleLine = re.sub(r"\d|\.|-|\[|`|\(|\)|_|‘|'|’", "", singleLine)
        if len(singleLine) > 2 and pattern.match(singleLine) and not noneOfThese.match(singleLine):
            names = singleLine.lower().split()
            howmany = len(names)
            student = None
            if howmany == 2:
                student = {
                    "_id": str(objectid.ObjectId()),
                    "grade": img,
                    "name": names[0],
                    "middle": names[1]
                }
            elif howmany == 3:
                student = {
                    "_id": str(objectid.ObjectId()),
                    "grade": img,
                    "name": names[0],
                    "middle": names[1],
                    "last1": names[2]
                }
            elif howmany == 4:
                student = {
                    "_id": str(objectid.ObjectId()),
                    "grade": img,
                    "name": names[0],
                    "middle": names[1],
                    "last1": names[2],
                    "last2": names[3]
                }
            elif howmany > 4:
                print('this student has to be added manually')
                print(names, img)

            if isinstance(student, dict):
                allStudents.append(student)


allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "10A",
    "name": "hernández",
    "middle": "vega",
    "last1": "rebeca",
    "last2": "guadalupe"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "10C",
    "name": "cen",
    "middle": "wang",
    "last1": "xiao",
    "last2": "vwen (wendy)"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "10C",
    "name": "van der laat",
    "middle": "gurdián",
    "last1": "rodrigo"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "11A",
    "name": "lan",
    "middle": "huang",
    "last1": "jéssica",
    "last2": "yeu huey"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "11A",
    "name": "vindas",
    "middle": "ferrer",
    "last1": "antonio",
    "last2": "de jesús"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "7C",
    "name": "benavides",
    "middle": "garro",
    "last1": "abigail",
    "last2": "de los ángeles"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "8A",
    "name": "álvarez",
    "middle": "rojas",
    "last1": "lucía",
    "last2": "de los ángeles"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "3A",
    "name": "álvarez",
    "middle": "rojas",
    "last1": "gloriana",
    "last2": "de los ángeles"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "8C",
    "name": "calderón",
    "middle": "espinosa",
    "last1": "de los monteros",
    "last2": "ma. paula"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "9C",
    "name": "solano",
    "middle": "brenes",
    "last1": "sofía",
    "last2": "del carmen"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "3B",
    "name": "hernández",
    "middle": "hernández",
    "last1": "gabriel",
    "last2": "de jesús"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "4A",
    "name": "pacheco",
    "middle": "vega",
    "last1": "elizabeth",
    "last2": "de los ángeles"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "4A",
    "name": "rodríguez",
    "middle": "quintero",
    "last1": "samara",
    "last2": "de los ángeles"
})


allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "4B",
    "name": "alvarado",
    "middle": "alfaro",
    "last1": "mariana",
    "last2": "del carmen"
})

allStudents.append({
    "_id": str(objectid.ObjectId()),
    "grade": "4B",
    "name": "alpízar",
    "middle": "delgado",
    "last1": "maría",
    "last2": "del 'milagro"
})

mycol.insert_many(allStudents)
