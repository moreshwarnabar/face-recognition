import json

from src.service.s3_service import download_frame
from src.service.s3_service import upload_result
from src.utils.face_recognition import face_recognition_function
from src.utils.file_writer import write_result

def lambda_handler(event, context):
    # extract the bucket name and frame name from the event
    bucket = event['Bucket']
    key = event['Key']
    # download the frame from S3
    download_frame(bucket, key)
    # call the face recognition function
    name = face_recognition_function(key)
    print(f'Recognized face in {key} as {name}')
    # write the result to a file
    file_name = write_result(key.split('.')[0], name)
    # upload the result to S3
    upload_result(file_name)
    print(f'Uploaded result for {key} into S3')
