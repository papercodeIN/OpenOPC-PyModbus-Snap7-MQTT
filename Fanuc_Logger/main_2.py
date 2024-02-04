from logging import exception
from pyfanuc import pyfanuc
import time,os
import pandas as pd
import datetime

data_logged = 0

DF_1 = pd.read_csv("Init_Data/column_name.csv")
all_column_name = DF_1.Variable.to_list()

DF_2 = pd.read_csv("Init_Data/display_column_name.csv")
display_column_name = DF_2.Variable.to_list()
M_DF = pd.DataFrame(columns = display_column_name)

def bit_status(n, k):
    return ((n & (1 << (k - 1))) >> (k - 1))

conn=pyfanuc('192.168.0.1')

while 1:

    print("[+]Info: Connecting...")
    if conn.connect():
        print("[+]Info: Connected.")
        try:
            while 1 :
                start = time.time()
                #print("[+]Info: Condition Checking...")
                if  (bit_status(int(conn.readpmc(1,1,0,1)[0]), 6) == 0) and (data_logged == 0) and (int(conn.readpmc(1,5,32,1)[32]) == 1) :
                    """If cycle is completed and logbit from cnc is on then log data one time in csv"""

                    print("[+]Info: Condition-1 : Cycle Data Logging...")
                    
                    try:
                        M_DF = M_DF.append(pd.DataFrame([[ v for k, v in conn.readmacro(500,594).items()]], columns=all_column_name)[display_column_name],ignore_index=False)
                        M_DF['TimeStamp'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S %p")
                        M_DF.to_csv(f"Report_{datetime.date.today()}.csv", mode='a', header=not os.path.exists(f"Report_{datetime.date.today()}.csv"))
                        print("[+]Info: Condition-1 : Data Logged.")
                        data_logged = 1
                        M_DF = M_DF[0:0]
                        print("[+]Info: Condition-1 : Data Log Flag Status : ", data_logged)
                    except:
                        print("[-]Error: Not ablt to write data in CSV file.")
                        pass

                    #print(f"[+]Info: Condition 1 Time : {time.time()-start}")

                elif (bit_status(int(conn.readpmc(1,1,0,1)[0]), 6) == 1) and (data_logged == 1):
                    """If Cycle is running and previous cycle data was logged into csv 
                    then reset data_logged bit to incert new record when condition matched"""

                    #print("[+]Info: Cycle is Running...")
                    data_logged = 0
                    print("[+]Info: Condition-2 : Data Log Flag Status : ", data_logged)

                    #print(f"[+]Info: Condition 2 Time : {time.time()-start}")

                else:
                    #print("[!]Warning: No Condition Matched!")
                    #print(f"[+]Info: No Condition Time : {time.time()-start}")
                    pass
                time.sleep(1)
        except:
            #print("[-]Error: Not Able to Read/Write.")
            pass
    else:
        print("[-]Error: Not Able to Conenct.")
        pass

    #conn.disconnect()
    time.sleep(5)