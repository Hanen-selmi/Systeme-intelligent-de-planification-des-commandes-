from fastapi import FastAPI, HTTPException, status
import mysql.connector

# Connect to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="projet"
)

# Create a cursor object
cursor = mydb.cursor()

app = FastAPI()