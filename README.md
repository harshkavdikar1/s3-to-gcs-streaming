# s3-to-gcs-streaming
Data Pipeline to stream data of a file from S3 bucket to Google Cloud Storage using AWS Lambda whenever a file is uploaded to S3

### Description
Need to develop a pipeline which can transfer the file (upto 5GB) from s3 to google cloud storage whenever a file is uploaded to the google cloud storage. There are some great tools that can be used but these tools doesn't support transferring of file on upload event in s3 or they are third party tools or they are big data tools which my organization was reluctant to use. Therefore, I developed a streaming application which would download the contents of the file in s3 bucket in chunks depending upon the memory of the lambda function and upload the chunks the to the gcs and continue this process until the file has been completely copied from s3 to google cloud storage. For this purpose [stream](https://nodejs.org/api/stream.html) library of nodejs has been used

### ⚙ How to run it
<ol>
    <li> run <code> npm install </code>
    <li> Replace following parameters in serverless.yml file 
        <ul>
            <li> gcsBucket : Destination in google cloud</li>
            <li> role : IAM role to be associated with lambda function </li>
            <li> S3SourceBucket : Source S3 bucket enter parameter existing: true under it if the bucket already exists </li>
        </ul>
    </li>
    <li> run <code>sls deploy</code> </li>
    <li> Test the code with <code> sls invoke -f functionName --logs </code></li>
</ol>


### Runtime metrics

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


##### Possible Alternates
<ul>
    <li><a href = https://cloud.google.com/storage/docs/gsutil>gsutil</a></li>
    <li> <a href = https://cloud.google.com/storage-transfer-service>google-storage-transfer-service</li>
</ul>