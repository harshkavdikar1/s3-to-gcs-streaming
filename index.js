console.log('Loading function');

const aws = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const { pipeline } = require('stream');

// Object of AWS S3
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

// Object of Google Cloud Storage
const storage = new Storage();

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
