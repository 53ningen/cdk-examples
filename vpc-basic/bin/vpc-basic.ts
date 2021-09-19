#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { VpcBasicStack } from '../lib/vpc-basic-stack';

const app = new cdk.App();
new VpcBasicStack(app, 'VpcBasicStack', {
});
