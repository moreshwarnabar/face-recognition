import boto3
import botocore

s3 = boto3.resource('s3')

def download_frame(bucket, key):
    try:
        s3.Bucket(bucket).download_file(key, f'/tmp/{key}')
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            print("The frame does not exist.")
        else:
            raise


def upload_result(file_name):
    bucket = '1229975385-output'
    s3.upload_file(file_name, bucket, file_name)