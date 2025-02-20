import Jabber from "jabber";
import supertest from "supertest";
import Web3 from "web3";
const PORT = 8080;
export const APP_URL = `http://localhost:${PORT}`;

/**
 * @DEV Only share constants that are not mutated between tests
 */

export const supertestApp = supertest(APP_URL); // Replace with your app's URL
export const provider = new Web3();
export const jabber = new Jabber();
