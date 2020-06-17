# multi-region-lambda-cdk
Implementation of a multi-region lambda with the AWS CDK, Route 53, and API Gateway

# Overview

This repository implements the AWS article on regional lambda using the AWS CDK.

Please see the article located here:

https://aws.amazon.com/blogs/compute/building-a-multi-region-serverless-application-with-amazon-api-gateway-and-aws-lambda/

This implementation varies slightly from the AWS article written in 2017, and utilizes Route53 failover with a primary and secondary record set.

# Compiling

You will need to have npm / node installed, along with typescript and the AWS CDK.

Run npm install to install everything needed by the project.

Use npm run build in order to build the project.

# AWS Resources Needed

The following resources are required to run the demo:
* Your own domain within AWS.
* Certificates for that domain created in multiple regions.
* The cdk deployed to your account.

# Running

```
cdk deploy -c hostedZoneName=YOURDOTCOMADDRESS.com 
-c hostedZoneId=ZYWQL6IKKZIWZ 
-c certarn1=ARN-FOR-YOUR-HOSTED-ZONE-REGION1
-c certarn2=ARN-FOR-YOUR-HOSTED-ZONE-REGION2
-c status1=OK -c status2=FAIL FailoverTest-Region1 FailoverTest-Region2
```

# Testing

Navigate to demo.YOURDOMAIN/hello to see the results of the lambda.

In order to change regions, run the above CDK deploy command and switch the OK and FAIL status between the status1 and status2 variables.

After waiting a few moments, refresh the URL, and you will see the region change.

