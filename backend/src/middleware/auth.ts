import { Context, Next } from 'hono';
import { verify } from 'hono/jwt'

export const authMiddleware = async (c: Context, next: Next) => {
  const header = c.req.header("authorization") || "";

  if(!header) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  const response = await verify(header, c.env.JWT_SECRET)

  if(response.id) {
    c.set('userId', response.id);
    await next()
  } else {
    c.status(403);
    return c.json({ error: "unauthorized" })
  }
};

