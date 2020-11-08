# Deploy to servers using TravisCI

This is an example repo for performing deployments on the server using TravisCI and it utilizes SSH/SCP as the primary means for performing deployments. This allows to deploy independently to any cloud (AWS, Azure, GCP, DigitalOcean, Linode, Vultr etc.) without worrying about the cloud provider's offerings.

**Disadvantage:**

- Does not allow you to deploy to multiple servers or take advantage of 

## About the App

This is a Node.js based application.

This is a very simple REST API which utilizes JWT (JSON Web Token) authentication for authenticating against a secure endpoint.