terraform {
  backend "azurerm" {
    resource_group_name  = "WeatherApp_group_tf"
    storage_account_name = "weatherapptfstate01"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}