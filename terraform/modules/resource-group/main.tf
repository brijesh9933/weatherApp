resource "azurerm_resource_group" "this" {
  name = "WeatherApp-${terraform.workspace}"
  location = var.location
}