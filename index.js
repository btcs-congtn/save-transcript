const { Pool,  } = require('pg')
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATBASE,
    password: process.env.PASSWORD,
    port: process.env.PASSWORD,
  })


exports.handle = async (event) => {
    try {
        const eventRecord = event.Records && event.Records[0],
              inputBucket = eventRecord.s3.bucket.name,
              key = eventRecord.s3.object.key,
              id = context.awsRequestId;
        const fileData = key.split('-');
        const likedId = fileData[0];
        const transcriptLink = `s3://${inputBucket}/${key}`;

        const response = await pool.query(
            `
            UPDATE call_logs 
            SET transcript_link = '${transcriptLink}' 
            WHERE linked_id = '${likedId}'
            `
        );

        return response
    }catch (err) {
        console.error(err);
        return err;
    }
}