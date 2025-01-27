import { StatusCodes } from "http-status-codes";
import { FollowUserInput } from "../src/api/users/users.types";
import { supertestApp } from "./shared";
import {
  fetchUsers,
  getNewTestData,
  pickRandomElementForArray,
  signPayload,
} from "./utils";

test("Follow a user", async () => {
  //We create 2 users straight in the case we are the very 1st test running on an empty DB
  await getNewTestData(true);
  const testData = await getNewTestData(true);

  let users = await fetchUsers();

  const otherUser = pickRandomElementForArray(
    users.filter((user) => user.id !== testData.userId)
  );

  const notFollowed = otherUser.followers.find(
    (follower) => follower.followerId === testData.userId
  );
  expect(notFollowed).toBeUndefined();

  const payload: FollowUserInput = {
    id: otherUser.id,
  };

  const signature = signPayload(testData.testAccount, payload);

  let response = await supertestApp
    .post("/users/follow")
    .set("x-wallet-signature", signature)
    .send(payload);

  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(JSON.parse(response.text)).toHaveProperty("id");

  users = await fetchUsers();

  let updatedOtherUser = users.find((user) => user.id === otherUser.id);

  let followed = updatedOtherUser?.followers.find(
    (follower) => follower.followerId === testData.userId
  );

  expect(followed).not.toBeUndefined();

  response = await supertestApp
    .post("/users/unfollow")
    .set("x-wallet-signature", signature)
    .send(payload);

  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(JSON.parse(response.text)).toHaveProperty("id");

  users = await fetchUsers();

  updatedOtherUser = users.find((user) => user.id === otherUser.id);

  followed = updatedOtherUser?.followers.find(
    (follower) => follower.followerId === testData.userId
  );

  expect(followed).toBeUndefined();
});
