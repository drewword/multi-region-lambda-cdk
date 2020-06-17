import * as cdk from '@aws-cdk/core';
import { DemoLambdaFunction } from './DemoLambdaFunction'
import { Route53HealthCheck } from './Route53HealthCheck';
import { HostedZoneRecordSet } from './HostedZoneRecordSet';

export interface CommonProps extends cdk.StackProps {
  regionCert: string;
  isPrimary: boolean;
  zoneName: string;
  zoneId: string;
  lambdaStatusCode: string
}

export class DemoLambdaStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: CommonProps) {
    super(scope, id, props);

    let zoneName = props?.zoneName || "";
    let zoneId = props?.zoneId || "";

    let lambdaFunc = new DemoLambdaFunction(this,
      props?.regionCert || "",
      this.region,
      zoneName,
      props?.lambdaStatusCode || "");

    let healthCheck = new Route53HealthCheck(this,
      lambdaFunc.restApi,
      this.region).healthCheck;

    new HostedZoneRecordSet(this, props?.isPrimary || false,
      lambdaFunc.restApi,
      zoneName,
      zoneId,
      healthCheck);

  }

}

