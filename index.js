console.log('Loading function');

const aws = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const { pipeline } = require('stream');

var credentials;

// Object of AWS S3
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context) => {

    // Get the s3 bucket and blob from the create event in S3
    const s3Bucket = event.Records[0].s3.bucket.name;
    const blob = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    console.log("S3 bucket name = ", s3Bucket);
    console.log("File created in S3 = ", blob);

    // Get gcs bucket and target file object in Google Cloud Storage
    const gcsBucket = storage.bucket(process.env.gcsBucket);
    const gcsTargetFile = gcsBucket.file(blob);

    console.log("Starting the pipeline to stream " + blob + " from S3 to GCS");

    // Get credentials from secret manager
    await getGCPCredentials()
        .then((secret) => {
            // Parse the credentials retrieved from secret manager
            credentials = JSON.parse(secret)
            console.log("Secret retrieved from secret manager!");
        })
        .catch((err) => {
            console.log("Unable to read data from secret manager")
            console.log(err)
        })

    // Object of Google Cloud Storage
    const storage = new Storage({ credentials: credentials, projectId: process.env.projectId });

    // Parameters to connect to s3 bucket
    var s3Params = { Bucket: s3Bucket, Key: blob };

    // Streaming Pipeline to send file from S3 to Google Cloud Storage
    pipeline(
        s3.getObject(s3Params).createReadStream(),
        gcsTargetFile.createWriteStream(),
        (err) => {
            if (err) {
                console.error('Pipeline failed', err);
            } else {
                console.log('Pipeline succeeded');
            }
        }
    );
};


/**
 *  Read google cloud platform credentials from secret manager
 */
function getGCPCredentials() {
    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: secretName }, function (err, data) {
            if (err) {
                if (err.code === 'DecryptionFailureException')
                    // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    reject(err);
                else if (err.code === 'InternalServiceErrorException')
                    // An error occurred on the server side.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    reject(err);
                else if (err.code === 'InvalidParameterException')
                    // You provided an invalid value for a parameter.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    reject(err);
                else if (err.code === 'InvalidRequestException')
                    // You provided a parameter value that is not valid for the current state of the resource.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    reject(err);
                else if (err.code === 'ResourceNotFoundException')
                    // We can't find the resource that you asked for.
                    // Deal with the exception here, and/or rethrow at your discretion.
                    reject(err);
            }
            else {
                // Decrypts secret using the associated KMS CMK.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                if ('SecretString' in data) {
                    let secret = data.SecretString;
                    resolve(secret)
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                    resolve(decodedBinarySecret)
                }
            }
        })
    });
}