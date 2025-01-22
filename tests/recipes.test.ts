import { StatusCodes } from "http-status-codes";
import { CreateRecipeInput } from "../src/api/recipes/recipes.schema";
import { provider, supertestApp } from "./shared";
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

  const recipeText = `Lorem ipsum odor amet, consectetuer adipiscing elit. Urna cras eros quis nunc interdum proin commodo; at curabitur. Ante malesuada at habitant vel nec consectetur. Suscipit semper integer amet iaculis curae a. Proin nisi condimentum habitant sociosqu diam id libero ante cras. Himenaeos natoque nostra nec scelerisque condimentum per. Senectus vel integer id curabitur cursus nisl auctor. Nullam hendrerit accumsan eros viverra phasellus. Dapibus bibendum adipiscing nisi eros interdum.

Tempus cubilia netus efficitur habitasse faucibus cras. Porta morbi a commodo duis; et augue diam auctor. Mattis sed potenti mi nascetur ac venenatis mus. Semper aliquam penatibus mattis facilisis odio. Nisl phasellus tincidunt porttitor; neque augue interdum. Cras feugiat morbi ultricies eget orci litora gravida. Amet orci fames pulvinar potenti praesent velit curae. Aliquam velit duis maecenas erat mus, bibendum lorem nunc. Viverra integer netus id varius; sollicitudin accumsan interdum rutrum.`;

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
    instructions: recipeText,
    created_by: testData.userId,
  };

  let response = await supertestApp.post("/recipes/create").send(payload);
  expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

  const signature = signPayload(testData.testAccount, payload);

  response = await supertestApp
    .post("/recipes/create")
    .set("x-wallet-signature", signature)
    .send(payload);

  console.log(response.text);
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
