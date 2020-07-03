import cv2
import sys
from os import listdir
from os.path import isfile, join

# Example command line invocation: 
# python ExtractImagesFromVideo.py C:/Users/Joon/Videos/DroneVideo/ C:/Work/LYIT/Dissertation/Captured_data/

video_path = sys.argv[1]
dest_path = sys.argv[2]

onlyfiles = [f for f in listdir(video_path) if isfile(join(video_path, f))]

for filename in onlyfiles:
    file_prefix = filename.split('.')[0]
    # Opens the Video file
    cap = cv2.VideoCapture(video_path + filename)
    i=0

    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret == False:
            break
        if i % 100 == 0:
            cv2.imwrite(dest_path + file_prefix + str(i) + '.jpg',frame)
        i+=1

    cap.release()
    cv2.destroyAllWindows()    
