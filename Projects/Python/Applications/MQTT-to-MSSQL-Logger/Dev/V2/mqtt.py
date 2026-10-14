# python3.6
import os
import datetime
import configparser
import sys

try:
    from paho.mqtt import client as mqtt_client
    import pandas as pd
    import urllib
    import pyodbc
    import sqlite3
    from sqlalchemy import create_engine
except:
    os.system("pip install -r requirements.txt")

import logging
logging.basicConfig(filename=f"LOGS/standard_logs_{datetime.date.today()}.log", 
					format='%(asctime)s %(message)s') 
logger=logging.getLogger() 
logger.setLevel(logging.DEBUG) 

os.system("cls")

config = configparser.ConfigParser()
config.read("config.txt")


broker   =config['BROKER']['Broker_Address']
port     =int(config['BROKER']['Broker_Port'])
topic    =config['BROKER']['Broker_Topic']
logging  =config['DB']['Enable_Logging']
S_Name   =config['DB']['SQL_Server']
DB_Name  =config['DB']['SQL_DB']
L_table  =config['DB']['LOGGING_TABLE']
T_table  =config['DB']['TEMP_TABLE']
R_table  =config['DB']['REALTIME_TABLE']
username =config['BROKER']['Broker_Username']
password =config['BROKER']['Broker_Password']


print(f"""
-----------------------------------------------------------------------------------
  _    ___  __                                                                     
 / \  |__  |__) |                                                                  
/~~~\ |___ |    |___                                                               
                                                                                  
 _  _   __  ___ ___    ___  __      __   __                __   __   __   ___  __  
| \/ | /  \  |   |      |  /  \    /__` /  \ |       |    /  \ / _` / _` |__  |__) 
|    | \__X  |   |      |  \__/    .__/ \__X |___    |___ \__/ \__> \__> |___ |  \ 


- MQTT Broker Add.   : {broker}                                                                
- MQTT Broker Port   : {port}
- MQTT Topic to Sub. : {topic}
- MQTT Data Logging  : {"Enable" if logging == 'Y' else "Disbale"}
- MSSQL Server       : {S_Name}
- Database Name      : {DB_Name}
- Logger Table       : {L_table}
- Temperory Table    : {T_table}
- Realtime Table     : {R_table}


- Press 'Ctrl + C' to Stop Service
-----------------------------------------------------------------------------------
""")


def MS_SQL_Dump(payload, logging):

    quoted = urllib.parse.quote_plus("DRIVER={SQL Server};SERVER=%s;DATABASE=%s;UID=sa;PWD=admin" %(S_Name, DB_Name))
    # quoted = urllib.parse.quote_plus("DRIVER={SQL Server};SERVER=%s;DATABASE=%s;Trusted_Connection=yes" %(S_Name, DB_Name))
    engine = create_engine('mssql+pyodbc:///?odbc_connect={}'.format(quoted))
    conn = pyodbc.connect('Driver={SQL Server};'
                              'Server=%s;'
                              'Database=%s;' %(S_Name, DB_Name))
    cursor = conn.cursor()

    DF = pd.read_json(payload)
    DF.reset_index(level=0, inplace=True)
    DF.rename(columns = {'index' : 'Variable'}, inplace = True)

    DF.to_sql(T_table, schema='dbo', con = engine, chunksize=500, method='multi', index=False, if_exists='replace')
    cursor.execute(f"UPDATE dbo.{R_table} SET dbo.{R_table}.data = dbo.{T_table}.data FROM dbo.{T_table} WHERE dbo.{T_table}.Variable = dbo.{R_table}.Variable")
    #cursor.execute(f"UPDATE dbo.%s SET dbo.%s.data = dbo.%s.data FROM dbo.%s WHERE dbo.%s.Variable = dbo.%s.Variable" %(R_table, R_table, T_table, T_table, T_table, R_table))
    #cursor.execute(f"UPDATE dbo.Realtime SET dbo.Realtime.data = dbo.TEMP.data FROM dbo.TEMP WHERE dbo.TEMP.Variable = dbo.Realtime.Variable")

    if logging == 'Y':
        DF.to_sql(L_table, schema='dbo', con = engine, chunksize=500, method='multi', index=False, if_exists='append')
    else:
        pass

    conn.commit()
    engine.dispose()

def on_message(client, userdata, msg):
    logging.info(f'[+]Info : Last MSG Received at : {datetime.datetime.now().strftime("%X")}', end = "\r")
    print(f'[+]Info : Last MSG Received at : {datetime.datetime.now().strftime("%X")}', end = "\r")
    try:
        MS_SQL_Dump(msg.payload.decode(),logging)
    except Exception as e:
        logging.error(e)
        logging.error("[-]Error : Unable to Log Data.")
        # print("[-]Error : Unable to Log Data.")



        
client = mqtt_client.Client('AEPL Python MQTT Client')
client.username_pw_set(username, password)
rc = client.connect(broker, port)

if rc == 0:
    logging.info("[+]Info : Connected to MQTT Broker.")
    client.subscribe("test")
else:
    logging.error("[-]Error : Failed to connect, return code : ", rc)
    print("[-]Error : Failed to connect, return code : ", rc)


if __name__ == '__main__':
    try:
        client.on_message = on_message
        client.loop_forever()
    except KeyboardInterrupt:
        sys.exit()
        pass


# client.loop_forever()

