# python3.6
import os
import datetime
os.system("cls")

try:
    from paho.mqtt import client as mqtt_client
    import pandas as pd
    import urllib
    import pyodbc
    import sqlite3
    from sqlalchemy import create_engine
except:
    os.system("pip install -r requirements.txt")


# broker = input("MQTT Broker Address     : ")
# port =   int(input("MQTT Broker Port        : "))
# topic =  input("MQTT Topic to Subscribe : ")
# logging =input("Enable Logging ? (Y/N)  : ")
# S_Name  =input("MSSQL Server Name       : ")
# DB_Name =input("Database Name           : ")
# L_table =input("Logger Table Name       : ")
# T_table =input("Temperory Table Name    : ")
# R_table =input("Realtime Table Name     : ")



os.system("cls")

broker = 'hairdresser.cloudmqtt.com'
port = 17795
topic = "test"
logging ="Y"
S_Name  ="PARROT"
DB_Name ="MQTT"
L_table ="LOG"
T_table ="TEMP"
R_table ="Realtime"

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

# username = 'kathan'
# password = 'kathan@123'

username = 'fxstxixx'
password = 'vclP1dwIhIHY'



def SQLite_Dump(payload, logging):

    DF = pd.read_json(payload)
    DF.reset_index(level=0, inplace=True)
    DF.rename(columns = {'index' : 'Variable'}, inplace = True)

    conn_sql = sqlite3.connect("Realtime.db")
    cur_sql = conn_sql.cursor()

    DF.to_sql('LOG_DATA', conn_sql , if_exists = 'append', index = False)
    if logging == 'Y':
        print("Inside Logging")
        # DF.to_sql('LOG', schema='dbo', con = engine, chunksize=500, method='multi', index=False, if_exists='replace')
    else:
        pass
    conn_sql.commit()
    cur_sql.close()
    conn_sql.close()

    # print("[+]Info : Data LOG Done.", end = "\r")



def MS_SQL_Dump(payload, logging):

    quoted = urllib.parse.quote_plus("DRIVER={SQL Server};SERVER=%s;DATABASE=%s;uid=sa;pwd=admin" %(S_Name, DB_Name))
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


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0: print("[+]Info : Connected to MQTT Broker.")
        else: print("[-]Error : Failed to connect, return code : ", rc)
    try:
        client = mqtt_client.Client('AEPL_Python_MQTT_Client')
        client.username_pw_set(username, password)
        client.on_connect = on_connect
        client.connect(broker, port)
    except:
        print("[-]Error : Unable to Connect.")
    finally:
        return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        print(f'[+]Info : Last MSG Received at : {datetime.datetime.now().strftime("%X")}', end = "\r")
        try:
            MS_SQL_Dump(msg.payload.decode(),logging)
        except Exception as e:
            print(e)
            print("[-]Error : Unable to Log Data.")

    client.subscribe(topic)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()



if __name__ == '__main__':
    try:
        run()
    except KeyboardInterrupt:
        pass

    # {"device_id":"2000000001","slave_id":"1","address":"0","value":"1"}
