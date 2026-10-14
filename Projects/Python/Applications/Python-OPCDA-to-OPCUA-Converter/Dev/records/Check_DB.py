import sqlite3

conn1 = sqlite3.connect("Temp.db")
cur1 = conn1.cursor()
cur1.execute("SELECT count(name) FROM sqlite_master WHERE type='table' AND name= 'TEMP_DATA'")

if cur1.fetchone()[0]==1 : 
    # cur1.execute("DELETE FROM TEMP_DATA;")
    print("[+]Info :  Table Already Exist")
    pass
else :
    print("""
[+]Info : Table Does Not Exist.
[+]Info : Creating Table
    """)
    cur1.execute("CREATE TABLE TEMP_DATA (VAR_ID INTEGER UNIQUE, VAR_NAME TEXT, VAR_VALUE TEXT, VAR_NODE_ID TEXT, PRIMARY KEY(VAR_ID AUTOINCREMENT));")
    conn1.commit()
cur1.close()
conn1.close()    