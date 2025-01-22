import { getMetadataSuccessfullResponseType } from "../src/api/metadata/metadata.schema";
import { supertestApp } from "./shared";

test("Get ingredients list", async () => {
  const response = await supertestApp.get("/ingredients/");
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);

  expect(response.body.length).toBeGreaterThan(500);
});

test("Get metadata", async () => {
  const response = await supertestApp.get("/metadata/");
  expect(response.status).toBe(200);
  const parsedResponse = response.body as getMetadataSuccessfullResponseType;

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
});
