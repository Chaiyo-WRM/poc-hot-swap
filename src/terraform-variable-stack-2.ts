import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { TerraformVariable } from "cdktf";
import type { Construct } from "constructs";
import {
  Terrakit,
  TerrakitController,
  TerrakitStack,
  type TerrakitOptions,
  type TerrakitStackConfig,
} from "terrakit";

const createController = (stack: TerrakitStack<TerrakitStackConfig>) => {
  const location = new TerraformVariable(stack, "location", {
    type: "string",
  });

  const contoller = new TerrakitController(stack, stack.providers).add({
    id: "resourceGroup",
    type: ResourceGroup,
    config: ({ outputs }) => ({
      name: "rg-example",
      location: location.value,
    }),
  });

  return contoller;
};

export function createTerraformVariableStack2(
  scope: Construct,
  options: TerrakitOptions<TerrakitStackConfig>
) {
  const terrakitStack = new TerrakitStack(scope, options);
  return new Terrakit(terrakitStack).setController(createController);
}
