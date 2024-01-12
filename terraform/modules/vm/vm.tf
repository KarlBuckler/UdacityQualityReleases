resource "azurerm_network_interface" "test" {
  name                = "${var.application_type}-${var.resource_type}-interface"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group}"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = "${var.subnet_id_test}"
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = "${var.public_ip_address_id}"
  }
}

resource "azurerm_linux_virtual_machine" "test" {
  name                = "${var.application_type}-${var.resource_type}-vm"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group}"
  size                = "Standard_DS2_v2"
  admin_username      = "adminuser"
  network_interface_ids = [azurerm_network_interface.test.id]
  admin_ssh_key {
    username   = "adminuser"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCHmskVUdc9L2UXcaFxFORWAOZOK90KiMw8yIaKX6XFjNpg7pJrhdOLqRqljre7jqAyLcYRh3H0VPDRGrZ9A6OAdpMlJArrrbdu8BpGRvaNEaXsAEjfNyDXx25GGJMzkDaCqc3mtmEkMPQNl8eS2O35RdWshQ5ZE1ubQ63fvIkdrlXnu3BB00wPzxY6HEQxmn7uqrRE6sFjh63C5jI86BbaIQ/wsGlSSWUu6IePz/sRYe1qDLxNAS4u02yjMZLzyv+xIrkFH2q3yo3lXDkjaoXC9paVSuNKkvf7I+ZyyhivvD9egUcWTx/O/wAujuLQmnWo8WzPrgUlvGO5RYxjOTzyyiJr/DZbLy+7KpvSNqpo56Iqffr915xeC45qCdcukkfH+6msBQY0ZkuY0PYWQqKGiQefD5j5TCRTZeLKj+MkgS+vrhPyTSDcOZ4wTs0uuubAFFd87d4w5fQnL+pVjFVB3tsckPKo/74rNcVuuU2SA3FXyPEuyaOUvCs95Siw9vM= kaibuech@DESKTOP-UF48C8O"
  }
  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  secure_boot_enabled = true
  source_image_id = "/subscriptions/d995408c-4c4c-4f60-b77d-84c709862d9b/resourceGroups/Assignement3/providers/Microsoft.Compute/galleries/Assignment3ComputeGallery/images/Assignment3VmImage"
}
