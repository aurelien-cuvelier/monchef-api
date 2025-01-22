import { StatusCodes } from "http-status-codes";
import { CreateUserInput } from "../src/api/users/users.schema";
import { supertestApp } from "./shared";
import { getNewTestData, signPayload } from "./utils";

test("Create a new user", async () => {
  const testData = await getNewTestData(false);

  const payload: CreateUserInput = {
    username: testData.testUsername,
    country_a3: "USA",
  };

  let response = await supertestApp.post("/users/create").send(payload);
  expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

  const signature = signPayload(testData.testAccount, payload);

  response = await supertestApp
    .post("/users/create")
    .set("x-wallet-signature", signature)
    .send(payload);

  console.log(response.text);

  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(JSON.parse(response.text)).toHaveProperty("id");

  response = await supertestApp
    .post("/users/create")
    .set("x-wallet-signature", signature)
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
