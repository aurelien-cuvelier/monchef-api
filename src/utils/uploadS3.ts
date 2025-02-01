require("dotenv").config();
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";

/**
 * @DEV this is a util file demonstrating how to upload a file to a S3 compatible (eg. tigris) bucket.
 * It is not actively used in this repo, but it is presented here as a model to be
 * implemented on your front-end for recipe/avatar pictures for example.
 */

const awsRegion = process.env.AWS_REGION;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsEndpointUrl = process.env.AWS_ENDPOINT_URL_S3;

if (
  !awsRegion ||
  !awsAccessKeyId ||
  !awsSecretAccessKey ||
  !awsBucketName ||
  !awsEndpointUrl
) {
  console.error(`Missing AWS ENV!`);
  process.exit(1);
}

const s3 = new S3Client({
  region: awsRegion,
  endpoint: awsEndpointUrl,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

uploadFileToS3(
  "./your.file",
  awsBucketName,
  //Make sure the key is unique otherwise it will overwrite files with an identical key
  "your-file-name"
);

async function uploadFileToS3(
  filePath: string,
  bucketName: string,
  key: string
): Promise<void> {
  try {
    const fileStream = fs.createReadStream(filePath);

    const upload = new Upload({
      client: s3,
      queueSize: 3,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
    });

    const response = await upload.done();
    console.log(`File uploaded successfully. Location: ${response.Location}`);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
}
