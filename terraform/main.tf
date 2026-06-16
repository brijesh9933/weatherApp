resource "azurerm_resource_group" "weather" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.weather.name
  location            = azurerm_resource_group.weather.location

  sku           = "Basic"
  admin_enabled = true
}

# Existing ACR where Azure DevOps pushes images
data "azurerm_container_registry" "existing_acr" {
  name                = "weatherappres"
  resource_group_name = "WeatherApp_group"
}

resource "azurerm_service_plan" "weather_plan" {
  name                = "weather-plan-tf"
  resource_group_name = azurerm_resource_group.weather.name
  location            = azurerm_resource_group.weather.location

  os_type  = "Linux"
  sku_name = "F1"
}

resource "azurerm_linux_web_app" "weather_app" {
  name                = "weatherapp-tf-demo"
  resource_group_name = azurerm_resource_group.weather.name
  location            = azurerm_resource_group.weather.location
  service_plan_id     = azurerm_service_plan.weather_plan.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on = false

    container_registry_use_managed_identity = true

    application_stack {
      docker_image_name   = "weather-app:latest"
      docker_registry_url = "https://${data.azurerm_container_registry.existing_acr.login_server}"
    }
  }
}

resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.existing_acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.weather_app.identity[0].principal_id
}