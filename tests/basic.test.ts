import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import { Web3 } from "web3";
import { getIngredientsSuccessfullResponseType } from "../src/api/ingredients/ingredients.schema";
import { getMetadataSuccessfullResponseType } from "../src/api/metadata/metadata.schema";
import { CreateRecipeInput } from "../src/api/recipes/recipes.schema";
import { CreateUserInput } from "../src/api/users/users.schema";
import { getRandomIngredientItems, pickRandomElementForArray } from "./utils";
const determStringify = require("fast-json-stable-stringify");

const PORT = 4000;

const provider = new Web3();

const testAccount = provider.eth.accounts.create();
const testUsername = `TEST_USER_${Date.now()}`;
let testUserId = -1;
const testRecipeName = `TEST_RECIPE_${Date.now()}`;
let ingredients = [] as getIngredientsSuccessfullResponseType;
let metadata = {} as getMetadataSuccessfullResponseType;

const app = supertest(`http://localhost:${PORT}`); // Replace with your app's URL

test("Get ingredients list", async () => {
  const response = await app.get("/ingredients/");
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);

  expect(response.body.length).toBeGreaterThan(500);

  ingredients = response.body;
});

test("Get metadata", async () => {
  const response = await app.get("/metadata/");
  expect(response.status).toBe(200);
  const parsedResponse = response.body as typeof metadata;

  expect(parsedResponse).toHaveProperty("tags");
  expect(Array.isArray(parsedResponse.tags)).toBe(true);

  expect(parsedResponse).toHaveProperty("chefRanks");
  expect(Array.isArray(parsedResponse.chefRanks)).toBe(true);

  expect(parsedResponse).toHaveProperty("mealType");
  expect(Array.isArray(parsedResponse.mealType)).toBe(true);

  expect(parsedResponse).toHaveProperty("difficulty");
  expect(Array.isArray(parsedResponse.difficulty)).toBe(true);

  expect(parsedResponse).toHaveProperty("units");
  expect(Array.isArray(parsedResponse.units)).toBe(true);

  expect(parsedResponse).toHaveProperty("countries");
  expect(Array.isArray(parsedResponse.countries)).toBe(true);

  metadata = parsedResponse;
});

test("Create a new user", async () => {
  const payload: CreateUserInput = {
    username: testUsername,
    country_a3: "USA",
  };

  let response = await app.post("/users/create").send(payload);
  expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

  const hashedPayload = provider.utils.sha3(determStringify(payload)) as string;
  const sig = testAccount.sign(hashedPayload);

  response = await app
    .post("/users/create")
    .set("x-wallet-signature", sig.signature)
    .send(payload);

  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(JSON.parse(response.text)).toHaveProperty("id");

  testUserId = JSON.parse(response.text).id;

  response = await app
    .post("/users/create")
    .set("x-wallet-signature", sig.signature)
    .send(payload);
  expect(response.statusCode).toBe(StatusCodes.CONFLICT);

  //It's now impossible to create a user with the wrong address since it is based
  //on the signature

  // const wrongSig = provider.eth.accounts.create().sign(hashedPayload);
  // response = await app
  //   .post("/users/create")
  //   .set("x-wallet-signature", wrongSig.signature)
  //   .send(payload);
  // expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
});

test("Create a new recipe", async () => {
  const randomTags = [] as typeof metadata.tags;
  const randomItems = [] as typeof ingredients;

  for (let i = 0; i < 4; i++) {
    randomTags.push(pickRandomElementForArray(metadata.tags));
    randomItems.push(pickRandomElementForArray(ingredients));
  }

  const recipeText = `Lorem ipsum odor amet, consectetuer adipiscing elit. Urna cras eros quis nunc interdum proin commodo; at curabitur. Ante malesuada at habitant vel nec consectetur. Suscipit semper integer amet iaculis curae a. Proin nisi condimentum habitant sociosqu diam id libero ante cras. Himenaeos natoque nostra nec scelerisque condimentum per. Senectus vel integer id curabitur cursus nisl auctor. Nullam hendrerit accumsan eros viverra phasellus. Dapibus bibendum adipiscing nisi eros interdum.

Tempus cubilia netus efficitur habitasse faucibus cras. Porta morbi a commodo duis; et augue diam auctor. Mattis sed potenti mi nascetur ac venenatis mus. Semper aliquam penatibus mattis facilisis odio. Nisl phasellus tincidunt porttitor; neque augue interdum. Cras feugiat morbi ultricies eget orci litora gravida. Amet orci fames pulvinar potenti praesent velit curae. Aliquam velit duis maecenas erat mus, bibendum lorem nunc. Viverra integer netus id varius; sollicitudin accumsan interdum rutrum.`;

  const payload: CreateRecipeInput = {
    name: testRecipeName,
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
    created_by: testUserId,
  };

  let response = await app.post("/recipes/create").send(payload);
  expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

  const hashedPayload = provider.utils.sha3(determStringify(payload)) as string;
  const sig = testAccount.sign(hashedPayload);

  response = await app
    .post("/recipes/create")
    .set("x-wallet-signature", sig.signature)
    .send(payload);

  console.log(response.text);
  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(JSON.parse(response.text)).toHaveProperty("id");

  const wrongSig = provider.eth.accounts.create().sign(hashedPayload);
  response = await app
    .post("/recipes/create")
    .set("x-wallet-signature", wrongSig.signature)
    .send(payload);

  expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
});
