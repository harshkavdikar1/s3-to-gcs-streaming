# s3-to-gcs-streaming
Data Pipeline to stream data of a file from S3 bucket to Google Cloud Storage using AWS Lambda whenever a file is uploaded to S3

### Description
Need to develop a pipeline which can transfer the file (upto 5GB) from s3 to google cloud storage whenever a file is uploaded to the google cloud storage. There are some great tools that can be used but these tools doesn't support transferring of file on upload event in s3 or they are third party tools or they are big data tools which my organization was reluctant to use. Therefore, I developed a streaming application which would download the contents of the file in s3 bucket in chunks depending upon the memory of the lambda function and upload the chunks the to the gcs and continue this process until the file has been completely copied from s3 to google cloud storage. For this purpose stream library of nodejs has been used.


### Pre-requisites
* Create a destination bucket in Google Cloud Storage
* Create a service account with write access to Google Cloud Storage
* Install Serverless (See [references](#References) for how to install)


### ⚙ How to run it
1. run <code> npm install </code>
2. Replace following parameters in serverless.yml file.
    * gcsBucket : Destination bucket in google cloud storage.
    * role : IAM role to be associated with lambda function.
    * S3SourceBucket : Source S3 bucket (check [serverless documentation]("https://www.serverless.com/framework/docs/providers/aws/events/s3/") if bucket already exists).
    * Optional : Replace other parameters like service name, function name, env variables as per requirement. 
3. run <code>sls deploy</code>
4. Test the code with <code> sls invoke -f functionName --logs </code>


### Runtime metrics of Lambda funtion
The following are the runtimes of lambda function which specify how much time it took for lambda function to run when a file of x MB is uploaded to S3 and Lambda is allocated y MB of memory.  
<table>
    <tr>
        <th> File Size </th>
        <th> Memory (MB) </th>
        <th> Run time duration (ms)</th>
    </tr>
    <tr>
        <td>500 MB</td>
        <td>128 MB</td>
        <td>80500</td>
    </tr>
    <tr>
        <td>500 MB</td>
        <td>256 MB</td>
        <td>41200</td>
    </tr>
    <tr>
        <td>500 MB</td>
        <td>512 MB</td>
        <td>20800</td>
    </tr>
    <tr>
        <td>500 MB</td>
        <td>1024 MB</td>
        <td>12200</td>
    </tr>
</table>


##### Possible Alternatives
* [gsutil](https://cloud.google.com/storage/docs/gsutil)
* [google-storage-transfer-service](https://cloud.google.com/storage-transfer-service)


##### References
[#Serverless Documentation](https://www.serverless.com/framework/docs/)  
[#Nodejs stream library](https://nodejs.org/api/stream.html)