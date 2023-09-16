import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";
import bcrypt from "bcryptjs";

const registerUserSchema = z.object({
  firstname: z.string().nonempty('First name is required'),
  lastname: z.string().nonempty('Last name is required'),
  email: z.string().nonempty('Email is required').email('Invalid email'),
  password: z.string().min(4, 'Password should be minimum 4 characters')
});
type RegisterInput = TypeOf<typeof registerUserSchema>;

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstname, lastname, email, password } = registerUserSchema.parse(req.body);
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (user) {
    return res.send({ user: null, message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstname,
      lastname,
      email,
      password: hashedPassword
    }
  });

  return res.send({ user: newUser, message: 'User created successfully' });
}