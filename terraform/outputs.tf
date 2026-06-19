output "resource_group_name" {
  value = module.resource_group.name
}

output "acr_name" {
  value = module.acr.name
}

output "acr_login_server" {
  value = module.acr.login_server
}

output "webapp_url" {
  value = module.webapp.webapp_url
}

