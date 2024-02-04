import sys

def absolute_value(num):
	"""This function returns the absolute
	value of the entered number"""

	if num >= 0:
		return num
	else:
		return -num

# Output: 2
#print(absolute_value(2))

while True:
    num = sys.stdin.readline() # read the stdin from the inject node
    num = int(num)
    print(absolute_value(num))
