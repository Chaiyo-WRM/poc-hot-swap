import { App } from "cdktf";
import { createMyStack } from "./MyStackNew";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { createTerraformVariableStack1 } from "./terraform-variable-stack-1";
import { createTerraformVariableStack2 } from "./terraform-variable-stack-2";

const app = new App();

createTerraformVariableStack1(app, {
  identifier: {
    env: "terraformVariableStack1",
    tenant: "terraformVariableStack1",
    slot: "terraformVariableStack1",
    site: "terraformVariableStack1",
  },
  providers: {
    defaultAzureProvider: (scope) =>
      new AzurermProvider(scope, "azurerm", {
        resourceProviderRegistrations: "core",
        subscriptionId: "0237f4be-418c-400e-ac3c-751807b4267b",
        features: [{}],
      }),
  },
}).build();

createTerraformVariableStack2(app, {
  identifier: {
    env: "terraformVariableStack2",
    tenant: "terraformVariableStack2",
    slot: "terraformVariableStack2",
    site: "terraformVariableStack2",
  },
  providers: {
    defaultAzureProvider: (scope) =>
      new AzurermProvider(scope, "azurerm", {
        resourceProviderRegistrations: "core",
        subscriptionId: "0237f4be-418c-400e-ac3c-751807b4267b",
        features: [{}],
      }),
  },
}).build();

const myStack = createMyStack(app, {
  identifier: {
    env: "prod",
    tenant: "contractor",
    slot: "prod",
    site: "active",
  },
  providers: {
    defaultAzureProvider: (scope) =>
      new AzurermProvider(scope, "azurerm_provider_default", {
        // skipProviderRegistration: true,
        resourceProviderRegistrations: "core",
        subscriptionId: "0237f4be-418c-400e-ac3c-751807b4267b",
        features: [{}],
      }),
  },
})
  .overrideResources({
    resourceGroup: {
      name: "rg-devops-playground",
    },
  })
  .build();

const myStack2 = createMyStack(app, {
  identifier: {
    env: "prod",
    tenant: "utility-etr",
    slot: "prod",
    site: "active",
  },
  providers: {
    defaultAzureProvider: (scope) =>
      new AzurermProvider(scope, "azurerm_provider_default", {
        resourceProviderRegistrations: "core",
        subscriptionId: "0237f4be-418c-400e-ac3c-751807b4267b",
        features: [{}],
      }),
  },
}).build();

app.synth();
