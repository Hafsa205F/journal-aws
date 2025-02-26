# Kubernetes provider to connect to EKS
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}

resource "kubernetes_secret" "journal_api_secret" {
  metadata {
    name = "journal-api-secret"
  }
  data = {
    DATABASE_URL = var.database_url
  }
}

# API Deployment
resource "kubernetes_deployment" "journal_api" {
  metadata {
    name = "journal-api"
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "journal-api"
      }
    }
    template {
      metadata {
        labels = {
          app = "journal-api"
        }
      }
      spec {
        container {
          image = "108782053371.dkr.ecr.eu-north-1.amazonaws.com/journal-api:latest"
          name  = "journal-api"
          command = ["node", "src/index.js"]
          port {
            container_port = 3000
          }
          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.journal_api_secret.metadata[0].name
                key  = "DATABASE_URL"
              }
            }
          }
          liveness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 10
            period_seconds = 30
          }
          readiness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 5
            period_seconds = 10
          }
        }
      }
    }
  }
}

# Service to expose the API
resource "kubernetes_service" "journal_api_service" {
  metadata {
    name = "journal-api-service"
  }
  spec {
    selector = {
      app = "journal-api"
    }
    port {
      protocol    = "TCP"
      port        = 80
      target_port = "3000"
    }
    type = "LoadBalancer"
  }
}

# Replace the kubernetes_job resource with this kubernetes_cron_job resource
resource "kubernetes_cron_job_v1" "journal_api_test" {
  metadata {
    name = "journal-api-test"
  }

  spec {
    # Schedule set to a special value that doesn't trigger automatically
    schedule = "* * 31 2 *"  # February 31st, which doesn't exist
    
    job_template {
      metadata {
        name = "journal-api-test"
      }
      spec {
        template {
          metadata {
            labels = {
              app = "journal-api-test"
            }
          }
          spec {
            container {
              name    = "journal-api-test"
              image   = "108782053371.dkr.ecr.eu-north-1.amazonaws.com/journal-api:latest"
              command = ["npm", "test"]
              
              env {
                name = "DATABASE_URL"
                value_from {
                  secret_key_ref {
                    name = kubernetes_secret.journal_api_secret.metadata[0].name
                    key  = "DATABASE_URL"
                  }
                }
              }
            }
            restart_policy = "Never"
          }
        }
        backoff_limit = 2
      }
    }
  }
}
