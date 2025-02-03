import { StatusCodes } from "http-status-codes";
import { CreateIngredientInput } from "../src/api/ingredients/ingredients.types";
import { jabber, supertestApp } from "./shared";
import {
  fetchIngredientsAndMedata,
  getNewTestData,
  signPayload,
} from "./utils";

test("Create a new ingredient", async () => {
  const { ingredients } = await fetchIngredientsAndMedata();

  const testData = await getNewTestData(true);

  const payload: CreateIngredientInput = {
    name: `TEST_INGREDIENT_` + Date.now(),
    description: jabber.createParagraph(200),
  };

  expect(
    ingredients.find((ingredient) => ingredient.name === payload.name)
  ).toBeUndefined();

  let signature = signPayload(testData.testAccount, payload);

  let res = await supertestApp
    .post("/ingredients/create")
    .send(payload)
    .set("x-wallet-signature", signature);

  expect(res.statusCode).toBe(StatusCodes.OK);
  expect(res.body.ok).toBe(true);

  const { ingredients: updatedIngredients } = await fetchIngredientsAndMedata();

  const foundCreatedIngredient = updatedIngredients.find(
    (ingredient) => ingredient.created_by_user_id === testData.userId
  );

  expect(foundCreatedIngredient).not.toBeUndefined();
  expect(foundCreatedIngredient?.name === payload.name);
});
