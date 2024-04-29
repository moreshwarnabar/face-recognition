import boto3
import botocore
import os

s3 = boto3.resource('s3')

def download_file(bucket, key):
    file_path = f'/tmp/{key}'
    try:
        s3.Bucket(bucket).download_file(key, file_path)
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            print("The file does not exist.")
            print(e.response['Error'])
        else:
            raise
    return file_path


def upload_result(file_name):
    bucket = '1229975385-output'
    key = os.path.basename(file_name)
    s3.Bucket(bucket).upload_file(file_name, key)