import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, LogDrivers } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Tags } from 'aws-cdk-lib';

export class BluetabCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'TestVpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'private-frontend',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          name: 'private-backend',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const cluster = new Cluster(this, 'TestCluster', {
      vpc,
      defaultCloudMapNamespace: {
        name: 'internal',
      },
    });


    // Imágenes Docker Hub
    const imageBackend = ContainerImage.fromRegistry('brayan979/flask-server:2');
    const imageFrontend = ContainerImage.fromRegistry('brayan979/web-blue:7');

    const backendTaskDefinition = new FargateTaskDefinition(this, 'BackendTaskDef', {
      memoryLimitMiB: 1024,
      cpu: 512,
    });

    backendTaskDefinition.addContainer('BackendContainer', {
      image: imageBackend,
      portMappings: [{ containerPort: 3005 }],
      logging: LogDrivers.awsLogs({ streamPrefix: 'backend' }),
    });

    const backendService = new FargateService(this, 'BackendService', {
      cluster,
      assignPublicIp: false,
      taskDefinition: backendTaskDefinition,
      desiredCount: 1,
      vpcSubnets: {
        subnetGroupName: 'private-backend',
      },
      cloudMapOptions: {
        name: 'backend',
      },
    });

    const frontendService = new ApplicationLoadBalancedFargateService(this, 'FrontendService', {
      cluster,
      memoryLimitMiB: 2048,
      assignPublicIp: true,
      cpu: 1024,
      desiredCount: 1,
      publicLoadBalancer: true,
      taskSubnets: {
        subnetGroupName: 'private-frontend',
      },
      taskImageOptions: {
        image: imageFrontend,
        containerPort: 3000,
        logDriver: LogDrivers.awsLogs({ streamPrefix: 'frontend' }),
      },
    });

    // Permitir que el frontend se comunique con el backend
    backendService.connections.allowFrom(
      frontendService.service,
      cdk.aws_ec2.Port.tcp(3005),
      'Allow frontend to connect to backend on port 3005',
    );

    Tags.of(this).add('cdk:test-bluetab', 'test-fargate');
  }
}
