import os
os.environ["TORCH_HOME"] = "/tmp/"


from src.service.s3_service import download_file
from src.service.s3_service import upload_result
from src.utils.face_recognition import face_recognition_function

def lambda_handler(event, context):
    # extract the bucket name and frame name from the event
    bucket = event['Bucket']
    key = event['Key']
    print(f'Received request for BUCKET: {bucket}, and KEY: {key}')
    # download the weights for the model
    download_file('cse546-project2-dependency', 'data.pt')
    print('Weights downloaded successfully!')
    # download the frame from S3
    file_path = download_file(bucket, key)
    print(f'Downloaded frame to PATH: {file_path}')
    # call the face recognition function
    name = face_recognition_function(file_path)
    print(f'Recognized face in {key} as {name}')
    # write the result to a file
    file_name = '/tmp/' + key.split('.')[0] + '.txt'
    # upload the result to S3
    upload_result(file_name)
    print(f'Uploaded result for {key} into S3')
