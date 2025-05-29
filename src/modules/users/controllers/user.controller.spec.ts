import { ResponseDto } from '@common/dtos/responses';
import { User } from '@datasource/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from '../dto';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';
import { Readable } from 'stream';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a ResponseDto with the user', () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      const result = controller.getUser(user);

      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: user,
      } as ResponseDto<User>);
    });
  });

  describe('update', () => {
    it('should call userService.update with user and dto', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      const dto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date().toString(),
      };

      const readableStream = new Readable({
        read() {
          // Implement your data reading logic here
        },
      });

      const mockFile = {
        fieldname: 'avatar',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        destination: 'uploads/',
        filename: 'avatar-1234567890-1234567890.jpg',
        path: 'uploads/avatar-1234567890-1234567890.jpg',
        buffer: Buffer.alloc(0),
        stream: readableStream,
      };

      await controller.update(user, dto, mockFile);
      expect(userService.update).toHaveBeenCalledWith(user, dto, mockFile);
    });

    it('should return a ResponseDto with the updated user', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      const dto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date().toString(),
      };
      const updatedUser = { ...user, ...dto } as User;

      (userService.update as jest.Mock).mockResolvedValue(updatedUser);

      const readableStream = new Readable({
        read() {
          // Implement your data reading logic here
        },
      });

      const mockFile = {
        fieldname: 'avatar',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        destination: 'uploads/',
        filename: 'avatar-1234567890-1234567890.jpg',
        path: 'uploads/avatar-1234567890-1234567890.jpg',
        buffer: Buffer.alloc(0),
        stream: readableStream,
      };

      const result = await controller.update(user, dto, mockFile);

      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: updatedUser,
      } as ResponseDto<User>);
    });
  });
});
