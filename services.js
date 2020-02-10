const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const bucketName = ''; // AWS Bucket name.

// configuring the AWS environment.
AWS.config.update({
    accessKeyId: '',
    secretAccessKey: ''
});

// create a new s3 instance.
const s3 = new AWS.S3();

module.exports = {
    /**
     * create a new object.
     */
    createObject: function(fileSource) {
        var params = {
            Bucket: bucketName,
            Body: fs.createReadStream(fileSource),
            Key: 'files/' + Date.now() + '_' + path.basename(fileSource),
            ACL: 'public-read'
        };
        s3.upload(params, function(err, data) {
            // handle error
            if (err) {
                console.log('Error', err);
            }
            // success
            if (data) {
                console.log('Uploaded in:', data.Location);
            }
        });
    },

    /**
     * return all the objects in the bucket.
     */
    listAllObjects: async function() {
        const objects = await module.exports.getObjects();
        return objects;
    },

    getObjects: function() {
        return new Promise(function(resolve, reject) {
            var params = {
                Bucket: bucketName
            };
            s3.listObjects(params, function(err, data) {
                if (err) {
                    return resolve([]);
                } else {
                    return resolve(data.Contents);
                }
            });
        });
    },

    /**
     * delete a single object from bucket.
     */
    deleteSingleObject: function(filename) {
        var params = {
            Bucket: bucketName,
            Key: filename
        };
        s3.deleteObject(params, function(err, data) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('Success', data);
            }
        });
    },

    /**
     * delete multiple objects from bucket.
     */
    deleteMultipleObjects: function(filenameList) {
        var params = {
            Bucket: bucketName,
            Delete: { Objects: filenameList }
        };
        s3.deleteObjects(params, function(err, data) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('Success', data);
            }
        });
    }
};
