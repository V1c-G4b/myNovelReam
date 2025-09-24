import { GetUserByIdUseCase } from "@/application/use-cases/user/get-user-by-id-use-case";
import { UserRepositoryImpl } from "@/infrastructure/repositories/drizzle-user-repository";
import { Elysia } from "elysia";
import { z } from "zod";

const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const notFoundSchema = z.object({
  message: z.literal("User not found"),
});

export const userController = (app: Elysia) =>
  app.group("/users", (app) =>
    app.get(
      "/:id",
      async (
        ctx
      ): Promise<
        z.infer<typeof userResponseSchema> | z.infer<typeof notFoundSchema>
      > => {
        const { params, set } = ctx as unknown as {
          params: { id: string };
          set: { status?: number };
        };
        const repository = new UserRepositoryImpl();
        const useCase = new GetUserByIdUseCase(repository);
        const user = await useCase.execute(params.id);
        if (!user) {
          set.status = 404;
          return { message: "User not found" } as const;
        }
        return user;
      },
      {
        auth: true,
        params: userIdParamsSchema,
        response: {
          200: userResponseSchema,
          404: notFoundSchema,
        },
        detail: {
          summary: "Get User by ID",
          tags: ["User"],
        },
      }
    )
  );
