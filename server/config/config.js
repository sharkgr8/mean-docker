module.exports = {
  dbhost: "mongodb://mongodb/api", // MongoDB URL from the docker-compose file
  JWT_SECRET: "ishaatulhaq786",
  upload_path: "/data/uploads/",

  //AWS Credentials
  aws: {
    credentials: {
      accessKeyId: "AKIAILM77XJ562KGSNKA",
      secretAccessKey: "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"
    },
    S3_config: { region: "ap-south-1", apiVersion: "2006-03-01", signatureVersion: "v4" },
    S3_Bucket: 'audio.ishaatulhaq'
  }
};
