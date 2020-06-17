import * as cdk from '@aws-cdk/core';
import apigateway = require("@aws-cdk/aws-apigateway");
import { Fn } from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';

export class Route53HealthCheck {

  healthCheck: route53.CfnHealthCheck;

  constructor(stack: cdk.Stack,
    restApi: apigateway.LambdaRestApi,
    region: string) {

    let checkURL = Fn.join("", [restApi.restApiId,
      ".execute-api.",
      region,
      ".",
    Fn.ref("AWS::URLSuffix")]);

    let healthCheckIdentifier = region + "-healthcheck";

    this.healthCheck = new route53.CfnHealthCheck(stack, "MyHealthCheck", {
      healthCheckTags: [{
        key: "Name",
        value: healthCheckIdentifier
      }],
      healthCheckConfig: {
        type: "HTTPS_STR_MATCH",
        failureThreshold: 1,
        fullyQualifiedDomainName: checkURL,
        searchString: "OK",
        resourcePath: Fn.join("", ["/",
          restApi.deploymentStage.stageName,
          "/hello"])
      }
    });
  }
}