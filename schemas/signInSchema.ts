import { z } from "zod";

export const signInSchema = z.object({
  //email we are writing it as identifier, production level stuff
  identifier: z.string(),
  password: z.string(),
});
