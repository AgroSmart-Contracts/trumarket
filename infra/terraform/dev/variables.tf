variable "region" {
  type        = string
  description = "AWS Region"
  default     = "eu-west-1"
}

variable "name" {
  type        = string
  description = "Stack name"
  default     = "trumarket-dev"
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "dev"
}

variable "domain" {
  type        = string
  description = "Load Balancers base domain"
  default     = "dev-app.trumarket.tech"
}

variable "repository" {
  type        = string
  description = "Source code repository"
  default     = "https://github.com/AgroSmartContracts/trumarket"
}
