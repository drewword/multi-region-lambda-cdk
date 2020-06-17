import apigateway = require("@aws-cdk/aws-apigateway");
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { Fn } from '@aws-cdk/core';

export class HostedZoneRecordSet {

    constructor(stack: cdk.Stack,
        isPrimary: boolean,
        restApi: apigateway.LambdaRestApi,
        zoneName: string,
        zoneId: string,
        healthCheck: route53.CfnHealthCheck) {

        let primaryStr = "PRIMARY";
        let setIdentifier = "primary-route";
        if (!isPrimary) {
            primaryStr = "SECONDARY";
            setIdentifier = "secondary-route";
        }

        let aliasTargetDomain = restApi.domainName?.domainNameAliasDomainName || "";
        let aliasTargetHostedZoneId = restApi.domainName?.domainNameAliasHostedZoneId || "";        // Try a raw cfn record set
        let route53RecordSet = new route53.CfnRecordSet(stack, "r53RecordSet", {
            name: "demo." + zoneName,
            type: "A",
            aliasTarget: {
                dnsName: aliasTargetDomain,
                hostedZoneId: aliasTargetHostedZoneId,
                evaluateTargetHealth: true
            },
            hostedZoneId: zoneId,
            failover: primaryStr,
            healthCheckId: Fn.ref(healthCheck.logicalId),
            setIdentifier: setIdentifier
        });
        route53RecordSet.addDependsOn(healthCheck);
    }

}
