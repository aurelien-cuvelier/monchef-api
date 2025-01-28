import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";
import { CreateUserInput, EditUserInput } from "../src/api/users/users.types";
import { jabber, supertestApp } from "./shared";
import {
  fetchIngredientsAndMedata,
  fetchUsers,
  getNewTestData,
  pickRandomElementForArray,
  signPayload,
} from "./utils";

test("Create a new user", async () => {
  const testData = await getNewTestData(false);

  const payload: CreateUserInput = {
    username: testData.testUsername,
    avatar: null,
    bio: null,
    country_a3: "USA",
    twitter: null,
    discord: null,
  };

  let response = await supertestApp.post("/users/create").send(payload);
  expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

  const signature = signPayload(testData.testAccount, payload);

  response = await supertestApp
    .post("/users/create")
    .set("x-wallet-signature", signature)
    .send(payload);

  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(JSON.parse(response.text)).toHaveProperty("id");

  response = await supertestApp
    .post("/users/create")
    .set("x-wallet-signature", signature)
    .send(payload);
  expect(response.statusCode).toBe(StatusCodes.CONFLICT);
});

test("Edit an existing user", async () => {
  const testData = await getNewTestData(true);
  const { ingredients: _, metadata } = await fetchIngredientsAndMedata();

  const users = await fetchUsers();

  const foundUser = users.find((user) => user.id === testData.userId);

  if (!foundUser) {
    throw new Error(`Could not find user`);
  }

  const { _count, recipes, reviews, created_at, ...cleanedUser } = foundUser;

  const userBefore = cleanedUser;
  expect(userBefore).toBeTruthy();

  const payload: EditUserInput = {
    username: faker.string.alphanumeric(
      faker.string.sample({ min: 5, max: 10 })
    ),
    country_a3: pickRandomElementForArray(metadata.countries).a3,
    avatar: `https://www.randomgsite.com/${faker.string.hexadecimal({
      length: 10,
    })}.png`,
    bio: jabber.createParagraph(200),
    twitter: "https://x.com/monchef_xyz",
    discord: "https://x.com/monchef_xyz",
  };

  let signature = signPayload(testData.testAccount, payload);

  let response = await supertestApp
    .post("/users/edit")
    .send(payload)
    .set("x-wallet-signature", signature);
  //console.log(response.text);
  expect(response.statusCode).toBe(StatusCodes.OK);

  const newUsers = await fetchUsers();
  const foundNewUser = newUsers.find((user) => user.id === testData.userId);

  if (!foundNewUser) {
    throw new Error(`Could not find new user`);
  }

  expect(foundNewUser.username).toBeTruthy();
  expect(
    userBefore.username !== foundNewUser.username &&
      foundNewUser.username === payload.username
  ).toBe(true);

  /**
   * @LINK see userCore @src/api/users/users.schema.ts
   */
  payload.bio = "";
  payload.twitter = "";
  payload.discord = "";
  payload.avatar = "";

  signature = signPayload(testData.testAccount, payload);

  response = await supertestApp
    .post("/users/edit")
    .send(payload)
    .set("x-wallet-signature", signature);

  expect(response.statusCode).toBe(StatusCodes.OK);

  const updatedUsers = await fetchUsers();

  const foundUpdatedUser = updatedUsers.find(
    (user) => user.id === testData.userId
  );

  if (!foundUpdatedUser) {
    throw new Error(`Could not find user`);
  }

  expect(foundUpdatedUser.bio).toStrictEqual("");
  expect(foundUpdatedUser.twitter).toStrictEqual("");
  expect(foundUpdatedUser.discord).toStrictEqual("");
  expect(foundUpdatedUser.avatar).toStrictEqual("");
});
