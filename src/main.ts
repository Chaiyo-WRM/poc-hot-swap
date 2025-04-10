import { App } from "cdktf";
import { createMyStack } from "./MyStackNew";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";

const app = new App();

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
