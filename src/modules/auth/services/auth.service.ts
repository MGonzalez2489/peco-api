import { BaseService, CryptService } from '@common/services';
import { User } from '@datasource/entities';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@users/services';
import { ChangePasswordDto, RegisterDto, SignInDto, TokenDto } from '../dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptService,
  ) {
    super();
  }

  /**
   * Signs in a user using the provided email and password.
   *
   * @param signInRequest - The sign in request object containing the user's email and password.
   * @returns A promise resolving to a token DTO containing the access token.
   */
  async signInAsync(signInRequest: SignInDto) {
    try {
      if (!signInRequest.password) {
        throw new BadRequestException('Password is required');
      }

      const user = await this.userService.findUserByEmailAsync(
        signInRequest.email,
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await this.cryptoService.compare(
        signInRequest.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = { sub: user.publicId };
      const token = await this.jwtService.signAsync(payload);
      const decodedToken = this.jwtService.decode<{ exp: number }>(token);

      const res: TokenDto = {
        access_token: token,
        expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
      };

      return res;
    } catch (error) {
      this.ThrowException('UserService::findUserByEmail', error);
    }
  }
  /**
   * Registers a new user with the provided email and password.
   *
   * @param dto The registration data transfer object.
   * @returns A promise resolving to a token DTO containing the access token for the new user.
   * @throws {ConflictException} If the email is already in use.
   * @throws {BadRequestException} If the email or password is missing.
   */
  async registerAsync(dto: RegisterDto) {
    try {
      // Input validation
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email and password are required.');
      }

      const existingUser = await this.userService.findUserByEmailAsync(
        dto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email already in use.');
      }

      await this.userService.createAsync({
        email: dto.email,
        password: dto.password,
      });

      return await this.signInAsync({
        email: dto.email,
        password: dto.password,
      });
    } catch (error) {
      this.ThrowException('AuthService::register', error);
    }
  }
  /**
   * Changes the password of the specified user.
   *
   * @param dto The change password data transfer object.
   * @param user The user to change the password for.
   * @returns The updated user.
   * @throws {BadRequestException} If the current password or new password is missing.
   * @throws {BadRequestException} If the current password is incorrect.
   * @throws {BadRequestException} If the new password is the same as the current password.
   */
  async changePasswordAsync(dto: ChangePasswordDto, user: User) {
    try {
      if (!dto.currentPassword || !dto.newPassword) {
        throw new BadRequestException(
          'Current password and new password are required',
        );
      }

      const passwordMatch = await this.cryptoService.compare(
        dto.currentPassword,
        user.password,
      );

      if (!passwordMatch) {
        throw new BadRequestException('Current password is incorrect');
      }

      if (dto.newPassword === dto.currentPassword) {
        throw new BadRequestException(
          'New password cannot be the same as the current password',
        );
      }

      await this.userService.updatePasswordAsync(
        dto.newPassword,
        user.publicId,
      );
      return user;
    } catch (error) {
      this.ThrowException('AuthService::changePassword', error);
    }
  }
}
