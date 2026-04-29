import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../../auth/presentation/types/request-with-user.interface';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    return this.getProfileUseCase.execute(req.user.sub);
  }

  @Patch('me')
  async updateProfile(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    return this.updateProfileUseCase.execute(req.user.sub, dto);
  }

  @Get()
  async listUsers() {
    return this.listUsersUseCase.execute();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
