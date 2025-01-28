import { IngredientModel } from "../../prisma/zod";


export const getIngredientsResponseSchema = IngredientModel.pick({id:true})