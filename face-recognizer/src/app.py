import json

def lambda_handler(event, context):
    message = f'Bucket: {event['Bucket']}, Key: {event['Key']}'
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Face-Recognition!')
    }