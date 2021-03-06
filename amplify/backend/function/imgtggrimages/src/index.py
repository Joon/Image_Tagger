import json
import boto3
import os

# This is a hack. TODO: Figure out how to pass bucket name into the lambda
images_bucket = "imgtggrqueueimages125908-dev"
 
def save_image_data(event):
    requested_path = event['path']  
    # Split path (e.g. "/images/Joon") into 2 parts
    path_parts = list(filter(None, requested_path.split("/")))
    queue = path_parts[1].lower()
    to_save = json.loads(event['body'])
    image_filename = to_save['sourceImageName']
    json_filename = pre, ext = os.path.splitext(image_filename)
    save_s3(event['body'], queue + "|" + pre + ".json")

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
    identifiers = list(filter(None, pre.split("|")))
    identifier = identifiers[-1]
    return { 'name': identifier, 'uri': download_url}

def get_image_list(event):
    s3 = boto3.client("s3")
    
    requested_path = event['path']  
    # Split path (e.g. "/images/Joon") into a max of 2 parts
    path_parts = list(filter(None, requested_path.split("/")))
    queue = path_parts[1].lower()

    availableFiles = []
    completedClassifications = []
    
    response = s3.list_objects_v2(
            Bucket = images_bucket,
            Prefix = "classification/" + queue + "|",
            MaxKeys = 1000 )
    if ('Contents' in response):
        completedClassifications = [get_image_data(x['Key']) for x in response['Contents'] if x['Size'] > 0]
        
    print("Reading from folder:" + path_parts[1])
    response = s3.list_objects_v2(
            Bucket = images_bucket,
            Prefix = queue + "/",
            MaxKeys = 1000 )
    
    if ('Contents' in response):
        availableFiles = [get_image_data(x['Key']) for x in response['Contents'] if x['Size'] > 0]
    
    return { 
        'availableFiles': availableFiles,
        'completedClassifications': completedClassifications
    }

supportedResources = {
        "GET/images": get_image_list,
        "POST/images": save_image_data
    }

def handler(event, context):
    print(json.dumps(event))
    
    requested_path = event['path']      
    print("Requested Path:" + requested_path)
    print(json.dumps(requested_path.split("/")))
    path_start = list(filter(None, requested_path.split("/")))[0]
    print("Path Start:" + path_start)
    
    required_method = event['httpMethod'] + "/" + path_start
    print("METHOD: " + required_method)
    processor = supportedResources.get(required_method, lambda x: "Unknown Request")
    
    response = {
        'statusCode': 200,
        'body': json.dumps(processor(event))
    }
    response["headers"] = {
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' }
    return response

