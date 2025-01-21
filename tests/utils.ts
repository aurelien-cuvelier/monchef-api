import { getIngredientsSuccessfullResponseType } from "../src/api/ingredients/ingredients.schema";
import { getMetadataSuccessfullResponseType } from "../src/api/metadata/metadata.schema";
import { CreateRecipeInput } from "../src/api/recipes/recipes.schema";

export function pickRandomElementForArray<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomIngredientItems(
  ingredients: getIngredientsSuccessfullResponseType,
  metadata: getMetadataSuccessfullResponseType,
  amount: number
): CreateRecipeInput["items"] {
  const chosenItems = [] as CreateRecipeInput["items"];

  for (let i = 0; i < amount; i++) {
    const decimal = Date.now() % 2 == 0;

    chosenItems.push({
      ingedient_id: pickRandomElementForArray(ingredients).id,
      quantity: decimal ? Math.random() * 100 : Math.floor(Math.random() * 100),
      unit: pickRandomElementForArray(metadata.units),
    });
  }

  return chosenItems;
}
