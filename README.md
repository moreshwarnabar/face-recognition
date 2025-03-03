# Face Recognition Video Processing Pipeline

This is a part of the coursework for the CSE-546 Cloud Computing class at Arizona State University.

## Overview  
This project implements a cloud-based video processing pipeline using AWS Lambda and AWS S3. The pipeline consists of two main functions:  
1. **Video Splitting**: Extracts a single frame from an uploaded video and stores it in an intermediate bucket.  
2. **Face Recognition**: Identifies the person in the extracted frame using a pre-trained model and stores the result in an output bucket.  

## Architecture  
![Face Recognition Pipeline](assets/architecture-diagram)
1. **Input Bucket (`<ASU_ID>-input`)**  
   - Stores uploaded videos.  
   - Uploading a new video triggers the **video-splitting Lambda function**.  
2. **Video Splitting Lambda Function (`video-splitting`)**  
   - Extracts one frame using `ffmpeg`.  
   - Stores the frame in **Stage-1 Bucket (`<ASU_ID>-stage-1`)**.  
   - Invokes the **face-recognition Lambda function** asynchronously.  
3. **Face Recognition Lambda Function (`face-recognition`)**  
   - Detects faces in the extracted frame.  
   - Identifies the person using a pre-trained ResNet model.  
   - Saves the identified name in a `.txt` file in **Output Bucket (`<ASU_ID>-output`)**.  

## Deployment  

### Prerequisites  
- AWS CLI configured with necessary permissions.  
- Docker installed for containerized deployments.  

### Steps  
1. **Build and Push Docker Images**  
   ```sh
   cd face-recognizer
   docker build -t face-recognizer .
   aws ecr create-repository --repository-name face-recognizer
   aws ecr get-login-password | docker login --username AWS --password-stdin <ECR_URL>
   docker tag face-recognizer:latest <ECR_URL>/face-recognizer:latest
   docker push <ECR_URL>/face-recognizer:latest
   ```  
   Repeat for `video-splitter`.  

2. **Deploy Lambda Functions**  
   ```sh
   aws lambda create-function --function-name video-splitting \
      --package-type Image --code ImageUri=<ECR_URL>/video-splitting:latest \
      --role <IAM_ROLE_ARN>

   aws lambda create-function --function-name face-recognition \
      --package-type Image --code ImageUri=<ECR_URL>/face-recognition:latest \
      --role <IAM_ROLE_ARN>
   ```  

3. **Create S3 Buckets**  
   ```sh
   aws s3 mb s3://<ASU_ID>-input
   aws s3 mb s3://<ASU_ID>-stage-1
   aws s3 mb s3://<ASU_ID>-output
   ```  

4. **Set up Event Triggers**  
   - Configure S3 event notifications to invoke `video-splitting` upon video upload.  

## Testing  
- Upload a `.mp4` video to `<ASU_ID>-input` bucket.  
- Check `<ASU_ID>-stage-1` for the extracted frame.  
- Verify that `<ASU_ID>-output` contains the recognized name in a `.txt` file.  

## Technologies Used  
- **AWS Lambda**: Serverless compute for video processing and face recognition.  
- **AWS S3**: Storage for input videos, extracted frames, and recognition results.  
- **FFmpeg**: Video processing for frame extraction.  
- **Facenet-PyTorch**: Face detection and recognition.  
- **Docker**: Containerized Lambda functions.  
- **TypeScript & Python**: Implementation of Lambda functions.  

## License  
This project is licensed under the **MIT License**.  
