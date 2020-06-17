import lambda = require("@aws-cdk/aws-lambda");
import * as cdk from '@aws-cdk/core';
import apigateway = require("@aws-cdk/aws-apigateway");
import certs = require("@aws-cdk/aws-certificatemanager");
import { EndpointType } from '@aws-cdk/aws-apigateway';

export class DemoLambdaFunction {

  restApi: apigateway.LambdaRestApi;

  constructor(stack: cdk.Stack,
    regionCert: string,
    region: string,
    zoneName: string,
    lambdaStatusCode: string) {

    const lambdaFunction = new lambda.Function(stack, 'helloWorldFunction', {
      code: new lambda.AssetCode('resources'),
      handler: 'lambdatest.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: { STATUS: lambdaStatusCode }
    });

    const helloWorldLambdaRestApi =
      new apigateway.LambdaRestApi(stack, 'helloWorldLambdaRestApi', {
        restApiName: 'Hello World API',
        handler: lambdaFunction,
        proxy: false
      });

    const hello = helloWorldLambdaRestApi.root.addResource('hello');
    hello.addMethod('GET', new apigateway.LambdaIntegration(lambdaFunction), {
      authorizationType: apigateway.AuthorizationType.NONE,
    });

    let certARN = regionCert;
    let certificate = certs.Certificate.fromCertificateArn(stack,
      "MyCertificate", certARN);

    helloWorldLambdaRestApi.addDomainName("ApiDomain-" + region, {
      certificate: certificate,
      domainName: "demo." + zoneName,
      endpointType: EndpointType.REGIONAL
    });

    this.restApi = helloWorldLambdaRestApi;
  }
}