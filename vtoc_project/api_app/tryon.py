# from custom py files
from .tryon_utils.openpose_json import generate_pose_keypoints
from .tryon_utils.cloth_mask import cloth_masking
from .tryon_utils.image_mask import make_body_mask
from .tryon_utils.inference import inference
import cv2
import shutil
import time
import base64
import subprocess
from werkzeug.utils import secure_filename
import os
import shutil


current_directory = os.getcwd()
parent_directory = os.path.abspath(os.path.join(current_directory, os.pardir))

main_dir = parent_directory + "\\vtoc_project\\api_app\\static\\data\\input\\"

image_dir = main_dir + "image\\"

cloth_dir = main_dir + "cloth\\"
cloth_mask_dir = main_dir + "cloth-mask\\"

warp_cloth_dir = main_dir + "warp-cloth\\"
warp_mask_dir = main_dir + "warp-mask\\"

load_model = parent_directory + '\\vtoc_project\\api_app\\tryon_utils\\checkpoints\\inference.pth'


def clean_data():
    
    main_dir = os.path.dirname(os.path.abspath(__file__))
    dir = os.path.join(main_dir, "static/data/input")
    for folder in os.listdir(dir):
        folder = os.path.join(dir, folder)
        if os.path.isdir(folder):
            for file in os.listdir(folder):
                os.remove(os.path.join(folder, file))

    dir2 = os.path.join(main_dir, "static\\result")
    for folder in os.listdir(dir2):
        folder = os.path.join(dir2, folder)
        shutil.rmtree(folder)


def create_image_to_base64(img):
    # Read the image file
    with open(img, 'rb') as f:
        image_bytes = f.read()

    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    data_uri = f'data:image/png;base64,{base64_image}'

    return data_uri

def fit_cloth(person_image, cloth_image):

    filename_person = person_image
    filename_cloth = cloth_image

    print("Images saved", "person: ", filename_person, "cloth: ", filename_cloth)

    # ..... Resize/Crop Images 192 x 256 (width x height) ..... #
    print(image_dir + filename_person, '=============================')
    img_p = cv2.imread(image_dir + filename_person)
    person_resize = cv2.resize(img_p, (192, 256))
    # save resized person image
    cv2.imwrite(image_dir + filename_person, person_resize)

    img_c = cv2.imread(cloth_dir + filename_cloth)
    cloth_resize = cv2.resize(img_c, (192, 256))
    # save resized cloth image
    cv2.imwrite(cloth_dir + filename_cloth, cloth_resize)
    # ----------------------------------------------------------------

    # ..... Cloth Masking ..... #
    cloth_masking(cloth_dir + filename_cloth, cloth_mask_dir + filename_cloth)

    # ..... Image parser ..... #
    inference(load_model, main_dir, filename_person)

    # ..... Person Image Masking ..... #
    make_body_mask(main_dir, filename_person)

    # ..... Generate Pose Keypoint's .....#
    generate_pose_keypoints(main_dir, filename_person)

    # ..... Write input sample pair txt file ..... #
    with open(parent_directory + "\\vtoc_project\\api_app\\static\\data\\test_samples_pair.txt", "w") as text_file:
        text_file.write(str(filename_person) + " " + str(filename_cloth))


    # ..... Run Geometric Matching Module(GMM) Model ..... #
    gmm_result = parent_directory + "\\vtoc_project\\api_app\\static\\result"
    gmm_test = parent_directory + "\\vtoc_project\\api_app\\tryon_utils\\test.py"
    gmm_chkpoint = parent_directory + "\\vtoc_project\\api_app\\tryon_utils\\checkpoints\\GMM\\gmm_final.pth"
    gmm_testpair = parent_directory + "\\vtoc_project\\api_app\\static\\data\\test_samples_pair.txt"

    cmd_gmm =  f"python {gmm_test} --name GMM --stage GMM --workers 1 --datamode input --data_list {gmm_testpair} --checkpoint {gmm_chkpoint} --result_dir {gmm_result}"

    subprocess.call(cmd_gmm, shell=True)

    # move generated files to data/input/
    warp_cloth = parent_directory + "\\vtoc_project\\api_app\\static\\result\\GMM\\input\\warp-cloth\\" + filename_person
    warp_mask = parent_directory + "\\vtoc_project\\api_app\\static\\result\\GMM\\input\\warp-mask\\" + filename_person

    shutil.copyfile(warp_cloth, warp_cloth_dir + filename_person)
    shutil.copyfile(warp_mask, warp_mask_dir + filename_person)

    # ..... Run Try-on Module(TOM) Model ..... #
    tom_result = parent_directory + "\\vtoc_project\\api_app\\static\\result"
    tom_test = parent_directory + "\\vtoc_project\\api_app\\tryon_utils\\test.py"
    tom_chkpoint = parent_directory + "\\vtoc_project\\api_app\\tryon_utils\\checkpoints\\TOM\\tom_final.pth"
    tom_testpair = parent_directory + "\\vtoc_project\\api_app\\static\\data\\test_samples_pair.txt"

    cmd_tom = f"python {tom_test} --name TOM --stage TOM --workers 1 --datamode input --data_list {tom_testpair} --checkpoint {tom_chkpoint} --result_dir {tom_result}"
    subprocess.call(cmd_tom, shell=True)

    return create_image_to_base64(parent_directory + '\\vtoc_project\\api_app\\static\\result\\TOM\\input\\try-on\\' + person_image)

if __name__ == "__main__":

    result = fit_cloth('person.jpg', 'cloth.jpg')
    print(result)
    # clean_data()
