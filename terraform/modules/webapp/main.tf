resource "azurerm_service_plan" "this" {
  name                = var.app_service_plan
  resource_group_name = var.resource_group_name
  location            = var.location

  os_type  = "Linux"
  sku_name = "F1"
}

resource "azurerm_linux_web_app" "this" {
  name                = var.app_service_name
  resource_group_name = var.resource_group_name
  location            = var.location

  service_plan_id = azurerm_service_plan.this.id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on = false

    container_registry_use_managed_identity = true

    application_stack {
      docker_image_name   = "weather-app:latest"
      docker_registry_url = var.acr_login_server
    }
  }
}

resource "azurerm_role_assignment" "acr_pull" {
  scope                = var.acr_scope
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.this.identity[0].principal_id
}
