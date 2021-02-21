import OpenOPC
opc = OpenOPC.client()
opc.connect("Matrikon.OPC.Simulation.1")
while True:
  data = opc.read('Random.Int1')[0]
  print(data)
