import { z } from "zod";
import { createRouter } from "./router";
import { procedure } from "./procedure";

const router = createRouter()
  .procedure(
    "ping",
    procedure().mutation(() => "pong")
  )
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

router.call("ping", { input: {} });
router.call("hello", { input: { name: "Yasu" } });
// router.call("hello", { input: { x: 1 } });
router.call("add", { input: { x: 1, y: 2 } });
// router.call("unknown", {});  // Type Error

const a = procedure()
  .input(z.object({ name: z.string() }))
  .query(({ input }) => `Hello, ${input.name}!`);
