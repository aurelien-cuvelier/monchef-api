import axios from "axios";
import { assert } from "console";
import { Web3Account } from "web3";
import { getIngredientsSuccessfullResponseType } from "../src/api/ingredients/ingredients.schema";
import { getMetadataSuccessfullResponseType } from "../src/api/metadata/metadata.schema";
import { CreateRecipeInput } from "../src/api/recipes/recipes.types";
import {
  CreateUserInput,
  CreateUserResponseType,
} from "../src/api/users/users.types";
import { APP_URL, provider } from "./shared";
const determStringify = require("fast-json-stable-stringify");

type TestData = {
  testAccount: Web3Account;
  testUsername: string;
  testRecipeName: string;
  userId: number;
};

export function signPayload(account: Web3Account, payload: object): string {
  const hashedPayload = provider.utils.sha3(determStringify(payload)) as string;
  const sig = account.sign(hashedPayload);

  return sig.signature;
}

export async function getNewTestData<T extends boolean>(
  createAccount: T
): Promise<T extends true ? TestData : Omit<TestData, "userId">> {
  const now = Date.now();
  const testAccount = provider.eth.accounts.create();
  const addrSlice = testAccount.address.slice(-4);
  const testUsername = `TEST_USER_${addrSlice}_${now}`;
  const testRecipeName = `TEST_RECIPE_${addrSlice}_${now}`;

  const payload: CreateUserInput = {
    username: testUsername,
    country_a3: "USA",
  };

  const signature = signPayload(testAccount, payload);
  const returnData = createAccount
    ? await new Promise<TestData>(async (resolve) => {
        const res = await axios.post<CreateUserInput, CreateUserResponseType>(
          APP_URL + "/users/create",
          payload,
          {
            headers: {
              "x-wallet-signature": signature,
            },
          }
        );

        //Axios does not infer?
        const inferedRes = res as any;

        assert(inferedRes.data?.id);

        resolve({
          testAccount,
          testUsername,
          testRecipeName,
          userId: inferedRes.data.id,
        });
      })
    : { testAccount, testUsername, testRecipeName };

  return returnData as T extends true ? TestData : Omit<TestData, "userId">;
}

export async function fetchIngredientsAndMedata(): Promise<{
  ingredients: getIngredientsSuccessfullResponseType;
  metadata: getMetadataSuccessfullResponseType;
}> {
  const resIngredients = await axios.get<getIngredientsSuccessfullResponseType>(
    APP_URL + "/ingredients"
  );

  const resMetadata = await axios.get<getMetadataSuccessfullResponseType>(
    APP_URL + "/metadata"
  );

  return { ingredients: resIngredients.data, metadata: resMetadata.data };
}

export function pickRandomElementForArray<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomIngredientItems(
  ingredients: getIngredientsSuccessfullResponseType,
  metadata: getMetadataSuccessfullResponseType,
  amount: number
): CreateRecipeInput["items"] {
  const chosenItems = [] as CreateRecipeInput["items"];

  for (let i = 0; i < amount; i++) {
    const decimal = Date.now() % 2 == 0;

    chosenItems.push({
      ingedient_id: pickRandomElementForArray(ingredients).id,
      quantity: decimal ? Math.random() * 100 : Math.floor(Math.random() * 100),
      unit: pickRandomElementForArray(metadata.units),
    });
  }

  return chosenItems;
}
