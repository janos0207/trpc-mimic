import { z } from "zod";
import { createRouter } from "./router";

const router = createRouter().procedure("hello", {
  input: z.object({ name: z.string() }),
  resolve: ({ input }) => `Hello, ${input.name}!`,
});

const result = router.call("hello", { name: "Janos" });
console.log(result);
