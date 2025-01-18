import supertest from "supertest";
import { Web3 } from "web3";
const determStringify = require("fast-json-stable-stringify");

const PORT = 4000;

const app = supertest(`http://localhost:${PORT}`); // Replace with your app's URL

test("Get ingredients list", async () => {
  const response = await app.get("/ingredients/");
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);

  expect(response.body.length).toBeGreaterThan(500);
});

test("Create a new user", async () => {
  const provider = new Web3();

  const account = provider.eth.accounts.create();

  const payload = {
    username: `TEST_${Date.now()}`,
    address: account.address,
    country: "USA",
  };

  const hashedPayload = provider.utils.sha3(determStringify(payload)) as string;
  const sig = account.sign(hashedPayload);

  const response = await app
    .post("/users/create")
    .set("x-wallet-signature", sig.signature)
    .send(payload);

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.text)).toHaveProperty("id");
});
