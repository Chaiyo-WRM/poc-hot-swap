import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { ServicePlan } from "@cdktf/provider-azurerm/lib/service-plan";
import { WindowsWebApp } from "@cdktf/provider-azurerm/lib/windows-web-app";
import type { Construct } from "constructs";
import {
  Terrakit,
  TerrakitController,
  TerrakitStack,
  type CallbackProvider,
  type TerrakitOptions,
} from "terrakit";
import type { SetRequired } from "type-fest";

export interface MyTerrakitStackConfig {
  identifier: {
    env: "dev" | "prod";
    tenant: "contractor" | "utility-etr";
    slot: "prod" | "staging";
    site: "active" | "dr";
  };
  providers: {
    defaultAzureProvider: CallbackProvider;
  };
}

export const createController = (
  stack: TerrakitStack<MyTerrakitStackConfig>
) => {
  return new TerrakitController(stack, stack.providers)
    .add({
      id: "resourceGroup",
      type: ResourceGroup,
      config: () => ({
        name: `rg-${stack.options.identifier.env}-${stack.options.identifier.tenant}`,
        location: "Central US",
      }),
    })
    .add({
      id: "servicePlanWindows",
      type: ServicePlan,
      config: ({ outputs }) => ({
        name: `asp-${stack.options.identifier.env}-${stack.options.identifier.tenant}-windows`,
        location: outputs.resourceGroup.location,
        resourceGroupName: outputs.resourceGroup.name,
        osType: "Windows",
        skuName: "P2v3",
        lifecycle: {
          ignoreChanges: ["sku_name"],
        },
      }),
    })
    .add({
      id: "windowsWebAppApi",
      type: WindowsWebApp,
      config: ({ outputs }) => ({
        name: `app-${stack.options.identifier.env}-${stack.options.identifier.tenant}-api`,
        location: outputs.resourceGroup.location,
        resourceGroupName: outputs.resourceGroup.name,
        servicePlanId: outputs.servicePlanWindows.id,
        identity: {
          type: "UserAssigned",
          identityIds: [
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-example/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-example", // TODO: azurerm_user_assigned_identity.common_key_vault_identity.id
          ],
        },
        siteConfig: {
          healthCheckPath: "/api/script/version", // TODO: local.health_check.default.path
          healthCheckEvictionTimeInMin: 2, // TODO: local.health_check.default.eviction_time_in_min
        },
        appSettings: {},
      }),
    });
};

export function createMyStack(
  scope: Construct,
  options: SetRequired<
    TerrakitOptions<MyTerrakitStackConfig>,
    "identifier" | "providers"
  >
) {
  const terrakitStack = new TerrakitStack<MyTerrakitStackConfig>(
    scope,
    options
  );
  return new Terrakit(terrakitStack).setController(createController);
}
