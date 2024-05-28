provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {}

locals {
  vpc_cidr = "10.0.0.0/16"
  azs      = slice(data.aws_availability_zones.available.names, 0, 2)

  api_name           = "api"
  api_container_port = 3000

  as_group = "${var.name}-as-group"

  tags = {
    Name        = var.name
    Environment = var.environment
    Repository  = var.repository
  }
}

################################################################################
# SSM parameters
################################################################################


data "aws_caller_identity" "current" {}

data "aws_ssm_parameter" "api_database" {
  name = "/${var.name}/api-database"
}

data "aws_ssm_parameter" "deals_manager_address" {
  name = "/${var.name}/deals-manager-address"
}

data "aws_ssm_parameter" "private_key" {
  name = "/${var.name}/private-key"
}

data "aws_ssm_parameter" "rpc_url" {
  name = "/${var.name}/rpc-url"
}

data "aws_ssm_parameter" "ecs_optimized_ami" {
  name = "/aws/service/ecs/optimized-ami/amazon-linux-2/recommended"
}


################################################################################
# Cluster
################################################################################

module "ecs_cluster" {
  source = "terraform-aws-modules/ecs/aws//modules/cluster"

  cluster_name = var.name

  # Capacity provider - autoscaling groups
  default_capacity_provider_use_fargate = false
  autoscaling_capacity_providers = {
    # On-demand instances
    (local.as_group) = {
      auto_scaling_group_arn         = module.autoscaling[local.as_group].autoscaling_group_arn
      managed_termination_protection = "ENABLED"

      managed_scaling = {
        maximum_scaling_step_size = 5
        minimum_scaling_step_size = 1
        status                    = "ENABLED"
        target_capacity           = 100
      }

      default_capacity_provider_strategy = {
        weight = 100
        base   = 20
      }
    }

  }

  tags = local.tags
}

module "ecs_service_api" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  # Service
  name        = "${var.name}-${local.api_name}"
  cluster_arn = module.ecs_cluster.arn

  cpu    = 512
  memory = 512

  # Task Definition
  requires_compatibilities = ["EC2"]
  capacity_provider_strategy = {
    # On-demand instances
    (local.as_group) = {
      capacity_provider = module.ecs_cluster.autoscaling_capacity_providers[local.as_group].name
      weight            = 1
      base              = 1
    }
  }

  # Container definition(s)
  container_definitions = {
    (local.api_name) = {
      essential = true
      # image     = data.aws_ecr_image.api.image_uri
      image = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/trumarket-api:latest-${var.environment}"

      health_check = {
        # command = ["CMD-SHELL", "curl -f http://localhost:${local.api_container_port}/ || exit 1"]
      }

      port_mappings = [
        {
          name          = local.api_name
          containerPort = local.api_container_port
          hostPort      = local.api_container_port
          protocol      = "tcp"
        }
      ]

      readonly_root_filesystem = false

      enable_cloudwatch_logging = true

      environment : [
        {
          name = "DATABASE_URL",
          # value = "mongodb://${local.mongo_name}/"
          value = data.aws_ssm_parameter.api_database.value
        },
        {
          name  = "BLOCKCHAIN_RPC_URL",
          value = data.aws_ssm_parameter.rpc_url.value
        },
        {
          name  = "BLOCKCHAIN_PRIVATE_KEY",
          value = data.aws_ssm_parameter.private_key.value
        },
        {
          name  = "DEALS_MANAGER_CONTRACT_ADDRESS",
          value = data.aws_ssm_parameter.deals_manager_address.value
        },
        {
          name  = "PORT",
          value = local.api_container_port
        },
        {
          name  = "S3_BUCKET",
          value = aws_s3_bucket.bucket.bucket
        },
        {
          name  = "AWS_REGION",
          value = var.region
        },
        {
          name  = "NODE_ENV",
          value = "production"
        },
        {
          name  = "LOG_LEVEL",
          value = "debug"
        }
      ]
    }
  }
  load_balancer = {
    service = {
      target_group_arn = module.alb.target_groups["trumarket_dev_ecs"].arn
      container_name   = local.api_name
      container_port   = local.api_container_port
    }
  }

  tasks_iam_role_name        = "${var.name}-tasks"
  tasks_iam_role_description = "Example tasks IAM role for ${var.name}"
  tasks_iam_role_policies = {
    ReadOnlyAccess = "arn:aws:iam::aws:policy/ReadOnlyAccess"
  }
  tasks_iam_role_statements = [
    {
      actions   = ["s3:GetObject", "s3:PutObject"]
      resources = ["arn:aws:s3:::*"]
    }
  ]

  subnet_ids = module.vpc.private_subnets
  security_group_rules = {
    alb_ingress = {
      type                     = "ingress"
      from_port                = local.api_container_port
      to_port                  = local.api_container_port
      protocol                 = "tcp"
      description              = "Service port"
      source_security_group_id = module.alb.security_group_id
    }
    egress_all = {
      type        = "egress"
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  tags = local.tags
}

################################################################################
# Load Balancers
################################################################################

module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 9.0"

  name = "${var.name}-api-lb"

  load_balancer_type = "application"

  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets

  # For example only
  enable_deletion_protection = false

  # Security Group
  security_group_ingress_rules = {
    all_http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
    all_https = {
      from_port   = 443
      to_port     = 443
      ip_protocol = "tcp"
      description = "HTTPS web traffic"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = module.vpc.vpc_cidr_block
    }
  }

  listeners = {
    http = {
      port     = 80
      protocol = "HTTP"

      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
    https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = "arn:aws:acm:eu-west-1:590183941756:certificate/a1e6fac0-2030-411a-92a7-76ee2e786a34"

      forward = {
        target_group_key = "trumarket_dev_ecs"
      }
    }
  }

  target_groups = {
    trumarket_dev_ecs = {
      backend_protocol                  = "HTTP"
      backend_port                      = local.api_container_port
      target_type                       = "ip"
      deregistration_delay              = 5
      load_balancing_cross_zone_enabled = true

      health_check = {
        enabled             = true
        healthy_threshold   = 5
        interval            = 30
        matcher             = "200"
        path                = "/"
        port                = "traffic-port"
        protocol            = "HTTP"
        timeout             = 5
        unhealthy_threshold = 2
      }

      # Theres nothing to attach here in this definition. Instead,
      # ECS will attach the IPs of the tasks to this target group
      create_attachment = false
    }

  }

  tags = local.tags
}

################################################################################
# Auto Scaling groups
################################################################################



module "autoscaling" {
  source  = "terraform-aws-modules/autoscaling/aws"
  version = "~> 6.5"

  for_each = {
    (local.as_group) = {
      instance_type              = "t2.micro"
      desired_capacity           = 1
      use_mixed_instances_policy = false
      mixed_instances_policy = {
        #   override = [
        #     {
        #       instance_type     = "t3.small"
        #       weighted_capacity = "2"
        #     }
        #   ]
      }
      user_data = <<-EOT
        #!/bin/bash

        cat <<'EOF' >> /etc/ecs/ecs.config
        ECS_CLUSTER=${var.name}
        ECS_LOGLEVEL=debug
        ECS_CONTAINER_INSTANCE_TAGS=${jsonencode(local.tags)}
        ECS_ENABLE_TASK_IAM_ROLE=true
        EOF
      EOT
    }
  }

  name = "${var.name}-${each.key}"

  image_id      = jsondecode(data.aws_ssm_parameter.ecs_optimized_ami.value)["image_id"]
  instance_type = each.value.instance_type

  security_groups                 = [module.autoscaling_sg.security_group_id]
  user_data                       = base64encode(each.value.user_data)
  ignore_desired_capacity_changes = true

  create_iam_instance_profile = true
  iam_role_name               = var.name
  iam_role_description        = "ECS role for ${var.name}"
  iam_role_policies = {
    AmazonEC2ContainerServiceforEC2Role = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
    AmazonSSMManagedInstanceCore        = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  }

  vpc_zone_identifier = module.vpc.private_subnets
  health_check_type   = "EC2"

  # https://github.com/hashicorp/terraform-provider-aws/issues/12582
  autoscaling_group_tags = {
    AmazonECSManaged = true
  }

  min_size         = 1
  max_size         = 2
  desired_capacity = 1

  # Required for  managed_termination_protection = "ENABLED"
  protect_from_scale_in = true

  # Spot instances
  use_mixed_instances_policy = each.value.use_mixed_instances_policy
  mixed_instances_policy     = each.value.mixed_instances_policy

  tags = local.tags
}

module "autoscaling_sg" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 5.0"

  name        = "${var.name}-autoscaling-sg"
  description = "Autoscaling group security group"
  vpc_id      = module.vpc.vpc_id

  computed_ingress_with_source_security_group_id = [
    {
      rule                     = "http-80-tcp"
      source_security_group_id = module.alb.security_group_id
    }
  ]
  number_of_computed_ingress_with_source_security_group_id = 1

  egress_rules = ["all-all"]

  tags = local.tags
}

################################################################################
# Network
################################################################################

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.name}-vpc"
  cidr = local.vpc_cidr

  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 48)]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = local.tags
}

################################################################################
# CLI and scheduled tasks
################################################################################

resource "aws_iam_role" "task_role" {
  name = "${var.name}-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sts:AssumeRole"
        ],
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = ["arn:aws:iam::aws:policy/ReadOnlyAccess"]

}

resource "aws_iam_role" "task_execution_role" {
  name = "${var.name}-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sts:AssumeRole"
        ],
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  inline_policy {
    name = "${var.name}-task-role-execution-policy"

    policy = jsonencode({ Version = "2012-10-17"
      Statement = [
        {
          "Action" = [
            "logs:PutLogEvents",
            "logs:CreateLogStream"
          ],
          "Effect"   = "Allow",
          "Resource" = "*",
          "Sid"      = "Logs"
        },
        {
          "Action" = [
            "ecr:GetDownloadUrlForLayer",
            "ecr:GetAuthorizationToken",
            "ecr:BatchGetImage",
            "ecr:BatchCheckLayerAvailability"
          ],
          "Effect"   = "Allow",
          "Resource" = "*",
          "Sid"      = "ECR"
        },
        {
          "Action"   = "ssm:GetParameters",
          "Effect"   = "Allow",
          "Resource" = "arn:aws:ssm:*:*:parameter/*",
          "Sid"      = "GetSSMParams"
        },
        {
          "Action"   = "secretsmanager:GetSecretValue",
          "Effect"   = "Allow",
          "Resource" = "arn:aws:secretsmanager:*:*:secret:*",
          "Sid"      = "GetSecrets"
        }
      ]
    })
  }
}


resource "aws_security_group" "allow_outbound" {
  name        = "allow_outbound"
  description = "Allow all outbound traffic"
  vpc_id      = module.vpc.vpc_id

  tags = local.tags
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.allow_outbound.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}


################################################################################
# Route 53
################################################################################

resource "aws_route53_zone" "zone" {
  name = "trumarket.tech"

  tags = local.tags
}

resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = module.alb.dns_name
    zone_id                = module.alb.zone_id
    evaluate_target_health = true
  }
}

################################################################################
# S3
################################################################################


resource "aws_s3_bucket" "bucket" {
  bucket = "${var.name}-bucket"

  tags = local.tags
}

resource "aws_s3_bucket_public_access_block" "bucket" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
             "s3:GetObject"
          ],
          "Resource": [
             "arn:aws:s3:::${aws_s3_bucket.bucket.id}/*"
          ]
      }
    ]
}
POLICY
}

################################################################################
# ECR
################################################################################

data "aws_ecr_image" "api" {
  repository_name = "trumarket-api"
  image_tag       = "latest-${var.environment}"
}
