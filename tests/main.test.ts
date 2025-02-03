import "./basic.test";
import "./follows.test";
import "./recipes.test";
import "./reviews.test";
import "./users.test";
import "./ingredients.test";

/**
 * @DEV
 * Some tests depend on others and cannot be ran before them, (eg. reviews.test needs at least a recipe to review)
 * So we import tests in a working order not to face issues if we deal with an empty DB
 *
 * @TODO
 * This is not a good practice but a temporary workaround, ideally tests should be executable in any order
 */
