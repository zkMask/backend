# import sys
# def recognize(image, db_path):
#     return image, db_path

# print(recognize(sys.argv[1], sys.argv[2]))

from deepface import DeepFace
import sys

db_path = sys.argv[2]
def recognize(img):
    recognized = DeepFace.find(img_path = img, db_path = db_path)
    # match_path = (recognized[0].identity[0])
    if(len(recognized) == 0):
        return False
    else:
        return True
    # result_id = match_path.split("\\")[-1].split("/")[0]
    # return result_id
    


print(recognize(sys.argv[1]))
# print(recognize("Hello"))
