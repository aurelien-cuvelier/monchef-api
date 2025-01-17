import supertest from "supertest";

const PORT = 4000;

const app = supertest(`http://localhost:${PORT}`); // Replace with your app's URL

test("Get ingredients list", async () => {
  const response = await app.get("/ingredients/");
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);

  expect(response.body.length).toBeGreaterThan(500);
});
