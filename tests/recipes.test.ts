import { StatusCodes } from "http-status-codes";
import { CreateRecipeInput } from "../src/api/recipes/recipes.types";
import { jabber, provider, supertestApp } from "./shared";
import {
  fetchIngredientsAndMedata,
  getNewTestData,
  getRandomIngredientItems,
  pickRandomElementForArray,
  signPayload,
} from "./utils";
const determStringify = require("fast-json-stable-stringify");

test("Create a new recipe", async () => {
  const { ingredients, metadata } = await fetchIngredientsAndMedata();
  const testData = await getNewTestData(true);

  const randomTags = [] as typeof metadata.tags;
  const randomItems = [] as typeof ingredients;

  for (let i = 0; i < 4; i++) {
    randomTags.push(pickRandomElementForArray(metadata.tags));
    randomItems.push(pickRandomElementForArray(ingredients));
  }

  const payload: CreateRecipeInput = {
    name: testData.testRecipeName,
    duration: Math.floor(Math.random() * 120),
    tags: randomTags,
    country_a3: pickRandomElementForArray(metadata.countries).a3,
    description:
      "This is a test recipe\nit's not recommended to actually try it as it might no be tasty",
    diffulty: pickRandomElementForArray(metadata.difficulty),
    meal_role: pickRandomElementForArray(metadata.mealType),
    images: [
      "https://i1.sndcdn.com/artworks-000495663411-j33q3m-t500x500.jpg",
      "https://i1.sndcdn.com/artworks-000495663411-j33q3m-t500x500.jpg",
      "https://i1.sndcdn.com/artworks-000495663411-j33q3m-t500x500.jpg",
      "https://i1.sndcdn.com/artworks-000495663411-j33q3m-t500x500.jpg",
    ],
    items: getRandomIngredientItems(
      ingredients,
      metadata,
      Math.floor(Math.random() * 20)
    ),
    instructions: jabber.createParagraph(500),
    created_by: testData.userId,
  };

  let response = await supertestApp.post("/recipes/create").send(payload);
  expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

  const signature = signPayload(testData.testAccount, payload);

  response = await supertestApp
    .post("/recipes/create")
    .set("x-wallet-signature", signature)
    .send(payload);

  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(JSON.parse(response.text)).toHaveProperty("id");

  const wrongSig = provider.eth.accounts
    .create()
    .sign(provider.utils.sha3(determStringify(payload)) as string);
  response = await supertestApp
    .post("/recipes/create")
    .set("x-wallet-signature", wrongSig.signature)
    .send(payload);

  expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
});
