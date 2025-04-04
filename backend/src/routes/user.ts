import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from '@pushanwa/bl-common'
import { verify } from 'hono/jwt'

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string,
      JWT_SECRET: string
    }
}>()

userRouter.post('/signup', async (c) => {
  
    try {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    
      const body = await c.req.json();

      const { success } = signupInput.safeParse(body);

      if(!success) {
        c.status(411);
        c.json({
          message: "invalid inputs"
        })
      }
    
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email }
      });
    
      if(existingUser) {
        c.status(403);
        return c.json({
          message: "user already exist",
        })
      }
    
    
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name
        },
      })
    
      const token = await sign({
        id: user.id
      }, c.env.JWT_SECRET)
    
    
      return c.json({jwt: token})
    } catch (e) {
      c.status(403);
      return c.json({
        message: "something went wrong with signup"
      })
    }
})
  
userRouter.post('/signin', async (c) => {

    try {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);

      if(!success) {
        c.status(411);
        c.json({
          message: "invalid inputs"
        })
      }

    const user = await prisma.user.findUnique({
        where: {
        email: body.email,
        password: body.password
        }
    });

    if(!user) {
        c.status(403);
        return c.json({ error: "user not found" })
    }

    const token = await sign({ id: user.id}, c.env.JWT_SECRET);

    return c.json({ jwt: token });

    } catch (e) {
      c.status(403);
      return c.json({
        message: "something went wrong with signin"
      })
    }
})

userRouter.get("/verifyToken", async (c) => {
  try{
    const header = c.req.header("authorization") || "";
    if(!header) {
      return c.json({ success: false }) 
    }
    
      const response = await verify(header, c.env.JWT_SECRET)
    
      if(!response.id) {
        return c.json({ success: false }) 
      }

      return c.json({ success: true })
    } catch (e) {
      return c.json({ success: false })
    }
});