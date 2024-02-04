import sqlite3
import pandas as pd
import random
import numpy as np
import time as t

conn = sqlite3.connect('TestDB.db')
cursor = conn.cursor()

cursor.execute("CREATE TABLE IF NOT EXISTS TEMP_DATA (SENSOR_ID INTEGER UNIQUE, SENSOR_NAME TEXT, SENSOR_VALUE TEXT, PRIMARY KEY(SENSOR_ID));")

DF = pd.read_sql_query("SELECT [SENSOR_ID], [SENSOR_NAME],[SENSOR_VALUE] from SENSOR_DATA", conn)
i = 0

while 1:
    try:
        DF['SENSOR_VALUE'] = np.random.uniform(0, 100, size = len(DF))
        
        cursor.execute("DELETE FROM TEMP_DATA;")
        DF.to_sql('TEMP_DATA', conn , if_exists = 'append', index = False)

        cursor.execute("PRAGMA synchronous = OFF")
        cursor.execute('PRAGMA journal_mode = OFF')
        cursor.execute(" UPDATE SENSOR_DATA SET SENSOR_VALUE = (SELECT SENSOR_VALUE FROM TEMP_DATA WHERE TEMP_DATA.SENSOR_ID = SENSOR_DATA.SENSOR_ID)")            

        conn.commit()
        t.sleep(0.5)
        i = i + 1
        print(f"[+]Info : No. of Time Table Update : {i}")
    
    except KeyboardInterrupt:
        break