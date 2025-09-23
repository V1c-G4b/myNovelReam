import { User } from "@/domain/entities/user";
import { UserRepository } from "@/domain/repositories/user-repository";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
