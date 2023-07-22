from deepface import DeepFace
import cv2

db_path = "/home/samarendra/Desktop/sample-rn-app/zkFace/backend/uploads"
def recognize(img):
    recognized = DeepFace.find(img_path = img, db_path = db_path)
    if(len(recognized) == 0):
        return False
    else:
        return True
    match_path = (recognized[0].identity[0])
    result_id = match_path.split("\\")[-1].split("/")[0]
    print(result_id)


result = recognize("/home/samarendra/Desktop/sample-rn-app/zkFace/backend/temps/temp.png")
print(result)
