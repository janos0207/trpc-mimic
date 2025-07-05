import { z } from "zod";
import { createRouter } from "./router";
import { procedure } from "./procedure";

const router = createRouter()
  .procedure(
    "hello",
    procedure()
      .input(z.object({ name: z.string() }))
      .query(({ input }) => `Hello, ${input.name}!`)
  )
  .procedure(
    "add",
    procedure()
      .input(z.object({ x: z.number(), y: z.number() }))
      .mutation(({ input }) => input.x + input.y)
  );

const result = router.call("hello", { name: "Yasu" });
console.log(result);
console.log(router.call("add", { x: 1, y: 2 }));
// router.call("unknown", {});  // Type Error
