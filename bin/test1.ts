#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DemoLambdaStack } from '../lib/DemoLambdaStack';

const app = new cdk.App();

let certARN1 = app.node.tryGetContext("certarn1");
let certARN2 = app.node.tryGetContext("certarn2");
let zoneName = app.node.tryGetContext("hostedZoneName");
let zoneId = app.node.tryGetContext("hostedZoneId");
let status1 = app.node.tryGetContext("status1");
let status2 = app.node.tryGetContext("status2");

const lambdaStack1 = new DemoLambdaStack(app, 'FailoverTest-Region1', {
    regionCert: certARN1,
    isPrimary: true,
    zoneName: zoneName,
    zoneId: zoneId,
    lambdaStatusCode: status1,
    env: {region: "us-east-1"}
});
const lambdaStack2 = new DemoLambdaStack(app, 'FailoverTest-Region2', {
    regionCert: certARN2,
    zoneName: zoneName,
    zoneId: zoneId,
    isPrimary: false,
    lambdaStatusCode: status2,
    env: {region: "us-west-1"}
});
