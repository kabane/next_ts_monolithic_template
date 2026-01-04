import { Hono } from "hono";
import { handle } from "hono/vercel";
import { registerUser, getUserById } from "@/app/services/user";

const app = new Hono().basePath("/api");

// Users endpoints
app.post("/users", async (c) => {
  try {
    const input = await c.req.json();
    const user = await registerUser(input);
    return c.json(user, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

app.get("/users/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const user = await getUserById(id);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Export for Next.js Route Handler
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
