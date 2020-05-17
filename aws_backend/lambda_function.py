import json
import boto3
import os

images_bucket = "joon-image-tag"
 
def save_image_data(event):
    to_save = json.loads(event['body'])
    image_filename = to_save['sourceImageName']
    json_filename = pre, ext = os.path.splitext(image_filename)
    save_s3(event['body'], pre + ".json")

def save_s3(save, file_name):
    encoded_string = save.encode("utf-8")

    s3_path = "classification/" + file_name

    s3 = boto3.resource("s3")
    s3.Bucket(images_bucket).put_object(Key=s3_path, Body=encoded_string)
 
def get_image_data(object_id):
    file_name = os.path.basename(object_id)
    pre, ext = os.path.splitext(file_name)
    s3 = boto3.client("s3")
    download_url = s3.generate_presigned_url('get_object',
                                        Params={'Bucket': images_bucket,
                                                'Key': object_id},
                                        ExpiresIn=3600 * 12)
    identifier = pre
    return { 'name': identifier, 'uri': download_url}

def get_image_list(event):
    s3 = boto3.client("s3")
    
    availableFiles = []
    completedClassifications = []
    
    response = s3.list_objects_v2(
            Bucket = images_bucket,
            Prefix = "classification/",
            MaxKeys = 1000 )
    if ('Contents' in response):
        completedClassifications = [get_image_data(x['Key']) for x in response['Contents'] if x['Size'] > 0]
        
    response = s3.list_objects_v2(
            Bucket = images_bucket,
            Prefix = event['queryStringParameters']['assigned_to'].lower() + "/",
            MaxKeys = 1000 )
    
    if ('Contents' in response):
        availableFiles = [get_image_data(x['Key']) for x in response['Contents'] if x['Size'] > 0]
    
    return { 
        'availableFiles': availableFiles,
        'completedClassifications': completedClassifications
    }

supportedResources = {
        "GET/imgtggr-images": get_image_list,
        "POST/imgtggr-images": save_image_data
    }

def lambda_handler(event, context):
    print(json.dumps(event))
    required_method = event['httpMethod'] + event['resource']
    print("METHOD: " + required_method)
    processor = supportedResources.get(required_method, lambda x: "Unknown Request")
    
    return {
        'statusCode': 200,
        'body': json.dumps(processor(event))
    }

