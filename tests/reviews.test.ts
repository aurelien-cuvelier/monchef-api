import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";
import {
  GetRecipesResponseType,
  GetRecipesSuccessfulResponseType,
} from "../src/api/recipes/recipes.types";
import { CreateReviewInput } from "../src/api/reviews/reviews.types";
import { supertestApp } from "./shared";
import {
  fetchRecipes,
  getNewTestData,
  pickRandomElementForArray,
  signPayload,
} from "./utils";

//We set a 10 sec timeout so it fails if no recipe can be fetched
test("Create a new review", async () => {
  const recipes = await new Promise<GetRecipesSuccessfulResponseType>(
    async (r) => {
      while (true) {
        const res = (await fetchRecipes()) as GetRecipesResponseType;

        const isError = "error" in res;
        if (isError || (!isError && res.length == 0)) {
          await new Promise((t) => setTimeout(t, 1500));
          continue;
        }

        r(res);
        break;
      }
    }
  );

  const testData = await getNewTestData(true);
  const randomRecipe = pickRandomElementForArray(recipes);

  const payload: CreateReviewInput = {
    title: `TEST_REVIEW` + faker.string.sample(5),
    rating: 1.55, //Not multiple of 0.5
    reviewedRecipeId: randomRecipe.id,
    description: faker.string.sample({ min: 100, max: 1000 }),
  };

  let signature = signPayload(testData.testAccount, payload);

  let res = await supertestApp
    .post("/reviews/create")
    .send(payload)
    .set("x-wallet-signature", signature);

  //bad request because unsupported rating
  expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
  expect(res.body).toHaveProperty("error");

  payload.rating = 2.5; //Fixing rating
  signature = signPayload(testData.testAccount, payload);

  res = await supertestApp
    .post("/reviews/create")
    .send(payload)
    .set("x-wallet-signature", signature);

  expect(res.statusCode).toBe(StatusCodes.OK);
  expect(res.body).not.toHaveProperty("error");
  expect(res.body).toHaveProperty("id");

  res = await supertestApp
    .post("/reviews/create")
    .send(payload)
    .set("x-wallet-signature", signature);

  //Conflict because the user already created a review for this recipe
  expect(res.statusCode).toBe(StatusCodes.CONFLICT);
  expect(res.body).toHaveProperty("error");

  payload.reviewedRecipeId = 694201337;
  signature = signPayload(testData.testAccount, payload);
  res = await supertestApp
    .post("/reviews/create")
    .send(payload)
    .set("x-wallet-signature", signature);

  //Not found because we gave an unexisting recipe id
  expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  expect(res.body).toHaveProperty("error");
}, 30_000);
