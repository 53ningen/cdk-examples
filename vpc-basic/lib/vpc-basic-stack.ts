import { Peer, Port, SecurityGroup, SubnetType, Vpc } from '@aws-cdk/aws-ec2'
import * as cdk from '@aws-cdk/core'

const VPC_CIDR = '10.0.0.0/16'
const CLIENT_CIDR = '0.0.0.0/0'

export class VpcBasicStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = new Vpc(this, 'vpc-basic', {
      cidr: VPC_CIDR,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private-isolated',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: 'private-with-nat',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    })
    const basicSecurityGroup = new SecurityGroup(this, 'basic', {
      securityGroupName: 'basic',
      vpc: vpc,
      allowAllOutbound: true,
    })
    basicSecurityGroup.addIngressRule(Peer.ipv4(CLIENT_CIDR), Port.tcp(22))
    basicSecurityGroup.addIngressRule(Peer.ipv4(CLIENT_CIDR), Port.tcp(3389))
    basicSecurityGroup.addIngressRule(Peer.ipv4(CLIENT_CIDR), Port.icmpPing())
    basicSecurityGroup.addIngressRule(Peer.ipv4(VPC_CIDR), Port.tcp(22))
    basicSecurityGroup.addIngressRule(Peer.ipv4(VPC_CIDR), Port.icmpPing())

    const httpSecurityGroup = new SecurityGroup(this, 'https', {
      securityGroupName: 'https',
      vpc: vpc,
      allowAllOutbound: true,
    })
    httpSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443))
    httpSecurityGroup.addIngressRule(Peer.anyIpv6(), Port.tcp(443))
    httpSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80))
    httpSecurityGroup.addIngressRule(Peer.anyIpv6(), Port.tcp(80))
  }
}
