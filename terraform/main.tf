module "resource_group" {
  source = "./modules/resource-group"

  resource_group_name = var.resource_group_name
  location            = var.location
}

module "acr" {
  source = "./modules/acr"

  acr_name            = var.acr_name
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
}

module "webapp" {
  source = "./modules/webapp"

  resource_group_name = module.resource_group.name
  location            = module.resource_group.location

  app_service_name = var.app_service_name
  app_service_plan = var.app_service_plan


  acr_login_server = "https://${data.azurerm_container_registry.existing_acr.login_server}"
  acr_scope        = data.azurerm_container_registry.existing_acr.id
}

# Existing ACR where Azure DevOps pushes images
data "azurerm_container_registry" "existing_acr" {
  name                = "weatherappres"
  resource_group_name = "WeatherApp_group"
}

