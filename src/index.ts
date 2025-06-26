import { z } from "zod";
import { createRouter } from "./router";
import { procedure } from "./procedure";

const router = createRouter().procedure("hello", {
  input: z.object({ name: z.string() }),
  resolve: ({ input }) => `Hello, ${input.name}!`,
});

const result = router.call("hello", { name: "Janos" });
console.log(result);

const echo = procedure()
  .input(z.object({ text: z.string() }))
  .query(({ input }) => {
    return { echoed: input.text };
  });

const result2 = echo.call({ text: "Hello Janos!" });
console.log(result2);
