# Backend resources are created by the AzureCLI bootstrap step in the pipeline.
# Keeping these resources out of Terraform prevents 409 conflicts when they already exist.
# Remote backend definition remains in backend.tf.

