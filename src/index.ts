import { z } from "zod";
import { createRouter } from "./router";

const router = createRouter()
  .procedure("hello", {
    input: z.object({ name: z.string() }),
    resolve: ({ input }) => `Hello, ${input.name}!`,
  })
  .procedure("add", {
    input: z.object({ x: z.number(), y: z.number() }),
    resolve: ({ input }) => input.x + input.y,
  });

const result = router.call("hello", { name: "Yasu" });
console.log(result);
console.log(router.call("add", { x: 1, y: 2 }));
// router.call("unknown", {});  // Type Error
