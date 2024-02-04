import OpenOPC
import sqlite3
import pywintypes
import pandas as pd
import datetime as t
import os
import urllib
import pyodbc
from sqlalchemy import create_engine
pywintypes.datetime=pywintypes.TimeType


def start():
    return OpenOPC.client()

def servers(opc):
    return opc.servers()

def connect(opc, server):
    try:
        opc.connect(server)
        info = dict(opc.info())
        if info['OPC Server'] == server:
            connected = True
        else:
            connected = False
    except Exception:
        connected = False
    return connected

def _tag_management(opc, OPC_Tags):
    print(f"[+]Info : Total Number of Tags With DDT : {len(OPC_Tags)}")
    for aliases in opc.list():
        try:
            for groups in opc.list(f'{aliases}.*'):
                try:
                    OPC_Tags.remove(aliases + "!" +groups)
                except:
                    pass
        except:
            pass

    print(f"[+]Info : Total Number of Individual Tags : {len(OPC_Tags)}")
    return OPC_Tags

def tags(opc):
    return sorted(_tag_management(opc, sorted(list(set([ x for x in (opc.list(recursive=True) + opc.list(flat=True)) if "#" not in x ])))))

def check_status(opc):
    return opc.ping()


def read_SQLite(opc, tags, datbase_name, table_name):
    print(f"[+]Info :  Tags to Read {tags}")
    results = opc.read(tags)
    return sqlite_append(results, datbase_name, table_name)
    # return csv_line(results)

def sqlite_append(results, datbase_name, table_name):
    try:
        conn = sqlite3.connect(f"{datbase_name}.db")
        cur = conn.cursor()

        DF = pd.DataFrame(results, columns = ['Tag','Value','Quality','Time'])
        DF.drop(DF[DF['Quality'] == "Bad" ].index, inplace = True)
        DF.to_sql(f'{table_name}', conn , if_exists = 'append', index = False)

        cur.close()
        conn.close()
        return f'[+]Info : {t.datetime.now()} : {len(DF)} : No. of Record logged into SQLite.'
        DF = DF[0:0]

    except:
        return f'[+]Info : {t.datetime.now()} : Unable to logged Record into SQLite.'


def demux_results(results):
    tags = [tag for tag, value, status, time in results]
    values = [value for tag, value, status, time in results]
    statuses = [status for tag, value, status, time in results]
    times = [time for tag, value, status, time in results]
    return tags, values, statuses, times


def read_MSSQL(opc, tags, servername, dbname, tablename):
    results = opc.read(tags)
    return MSSQL_append(results, servername, dbname, tablename)

def MSSQL_append(results, servername, dbname, tablename):
    quoted = urllib.parse.quote_plus("DRIVER={one};SERVER={two};DATABASE={three}".format(one = "SQL Server", two = servername, three = dbname))
    engine = create_engine('mssql+pyodbc:///?odbc_connect={}'.format(quoted))    
    
    # engine = create_engine('mssql+pyodbc:///?odbc_connect={urllib.parse.quote_plus("DRIVER={one};SERVER={two};DATABASE={three}")'.format(one = "SQL Server", two = servername, three = dbname))

    DF = pd.DataFrame(results, columns = ['Tag','Value','Quality','Time'])
    DF.drop(DF[DF['Quality'] == "Bad" ].index, inplace = True)
    DF.to_sql(f'{str(tablename)}', schema='dbo', con = engine, chunksize=650, method='multi', index=False, if_exists='append')

    engine.dispose()
    return f'[+]Info : {t.datetime.now()} : {len(DF)} No. of Record Logged into MSSQL.'


def read_CSV(opc, tags, filename, filepath):
    results = opc.read(tags)
    return csv_append(results, filename, filepath)

def csv_append(results, filename, filepath):
    try:
        if os.path.isfile(f'{filepath}\{t.date.today()}_{filename}.csv') == True:
            print("File Exist")
            
            temp_df = pd.DataFrame(results, columns = ['Tag','Value','Quality','Time'])
            temp_df.to_csv(f'{filepath}\{t.date.today()}_{filename}.csv', mode='a', header=False, index=False)
            
            return f'[+]Info : {t.datetime.now()} : {len(temp_df)} No. of Record Logged into CSV.'

        elif os.path.isfile(f'{filepath}\{t.date.today()}_{filename}.csv') == False :
            print("File Not Exist")

            temp_df = pd.DataFrame(results, columns = ['Tag','Value','Quality','Time'])
            temp_df.to_csv(f'{filepath}\{t.date.today()}_{filename}.csv', mode='a', header=True, index=False)
            
            return f'[+]Info : {t.datetime.now()} : {len(temp_df)} No. of Record Logged into CSV.'
    except Exception as e:
        print(e)
        return f'[-]Error : {t.datetime.now()} : Unable to Log Records Into CSV : CAUSE : File is OPEN.'

