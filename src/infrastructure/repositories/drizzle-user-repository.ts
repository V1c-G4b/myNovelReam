import { User } from "@/domain/entities/user";
import { UserRepository } from "@/domain/repositories/user-repository";
import { db } from "@/infrastructure/db/client";
import { users } from "@/infrastructure/persistence/schema";
import { eq } from "drizzle-orm";

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!row) return null;

    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
