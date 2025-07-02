/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AccountService } from '@accounts/services/account.service';
import { EntryTypeEnum } from '@catalogs/enums';
import { PeriodTypeEnum } from '@common/enums';
import { BaseService, CryptService } from '@common/services';
import { GetPeriodByType } from '@common/utils';
import { User } from '@datasource/entities';
import { EntryService } from '@entries/services';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from '@storage/storage.service';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  GeneralBalanceDto,
  GeneralInfoDto,
  TotalIncomeDto,
  TotalOutcomeDto,
  UpdateUserDto,
  UserCreateDto,
} from '../dto';
import { UserSeedService } from './user-seed.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    @Inject(CryptService) private readonly cryptoService: CryptService,
    @Inject(UserSeedService) private readonly userSeedService: UserSeedService,
    @Inject(StorageService) private readonly storageService: StorageService,
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(EntryService) private readonly entryService: EntryService,
  ) {
    super();
  }

  /**
   * Finds a user by their email address.
   *
   * @param email The email address to search for.
   * @returns The user with the specified email address, or null if not found.
   * @throws {InternalServerErrorException} If an error occurs while searching for the user.
   */
  async findUserByEmailAsync(email: string) {
    try {
      return this.repository.findOneBy({ email });
    } catch (error) {
      this.ThrowException('UserService::findUserByEmail', error);
    }
  }
  /**
   * Finds a user by their public ID.
   *
   * @param id The public ID to search for.
   * @returns The user with the specified public ID, or null if not found.
   * @throws {InternalServerErrorException} If an error occurs while searching for the user.
   */
  async findUserByPublicIdAsync(publicId: string) {
    try {
      const user = await this.repository.findOneBy({ publicId });
      return user;
    } catch (error) {
      this.ThrowException('UserService::findUserByPublicId', error);
    }
  }

  /**
   * Creates a new user with the provided data.
   *
   * @param dto The user creation data transfer object.
   * @returns The newly created user.
   * @throws {InternalServerErrorException} If an error occurs while creating the user.
   */
  async createAsync(dto: UserCreateDto) {
    try {
      // Validate the input data
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email and password are required');
      }

      const user = this.repository.create({
        email: dto.email,
        password: await this.cryptoService.encryptText(dto.password),
        avatar: 'images/avatar-placeholder.webp',
      });
      await this.repository.save(user);

      // Seed all default info required for the user
      await this.userSeedService.seed(user);

      return user;
    } catch (error) {
      this.ThrowException('UserService::create', error);
    }
  }

  /**
   *@param newPassword New password value, it should be encrypted by auth service
   *@param userId User's publicId to update the value
   * // This Function is only used by auth service
   */
  async updatePasswordAsync(newPassword: string, userId: string) {
    try {
      const user = await this.findUserByPublicIdAsync(userId);

      return await this.repository.save({
        id: user!.id,
        password: await this.cryptoService.encryptText(newPassword),
      });
    } catch (error) {
      this.ThrowException('UserService::updatePass', error);
    }
  }

  async update(user: User, dto: UpdateUserDto, avatar?: Express.Multer.File) {
    //TODO: use a default avatar img and make (?) user.avatar not null
    //TODO: Think on a blob storage to handle uploads

    if (
      user.avatar &&
      avatar &&
      !user.avatar.includes('avatar-placeholder.webp')
    ) {
      this.storageService.deleteUploadFile(user.avatar);
    }

    await this.repository.save({
      ...user,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      avatar: avatar ? `uploads/${avatar.filename}` : user.avatar, // avatar?.filename,
      avatarFullPath: avatar ? avatar.path : '',
    });
    return await this.repository.findOneBy({ id: user.id });
  }

  // async getGeneralInfoAsync(periodType: PeriodTypeEnum, user: User) {
  //   const period = GetPeriodByType(periodType)!;
  //
  //   // Optimización 1: Obtener los totales de ingresos y egresos directamente desde la BD
  //   // en lugar de traer todas las entradas y luego filtrar en memoria.
  //   const [totalIncomeAmountResult] = await this.entryService.repository
  //     .createQueryBuilder('entry')
  //     .select('SUM(entry.amount)', 'sum') // Selecciona la suma de los montos
  //     .leftJoin('entry.type', 'type')
  //     .leftJoin('entry.account', 'account')
  //     .leftJoin('account.user', 'user')
  //     .where('user.id = :userId', { userId: user.id })
  //     .andWhere('entry.createdAt BETWEEN :from AND :to', {
  //       from: new Date(period.from),
  //       to: new Date(period.to),
  //     })
  //     .andWhere('type.name = :incomeType', {
  //       incomeType: EntryTypeEnum.Income.toString(),
  //     })
  //     .getRawMany(); // Usa getRawMany() para obtener el resultado de una función de agregación
  //
  //   const [totalOutcomeAmountResult] = await this.entryService.repository
  //     .createQueryBuilder('entry')
  //     .select('SUM(entry.amount)', 'sum')
  //     .leftJoin('entry.type', 'type')
  //     .leftJoin('entry.account', 'account')
  //     .leftJoin('account.user', 'user')
  //     .where('user.id = :userId', { userId: user.id })
  //     .andWhere('entry.createdAt BETWEEN :from AND :to', {
  //       from: new Date(period.from),
  //       to: new Date(period.to),
  //     })
  //     .andWhere('type.name = :outcomeType', {
  //       outcomeType: EntryTypeEnum.Outcome.toString(),
  //     })
  //     .getRawMany();
  //
  //   // Convierte los resultados de la suma a número, manejando el caso de null si no hay entradas.
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   const tIncomeAmount = Number(totalIncomeAmountResult?.sum) || 0;
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   const tOutcomeAmount = Number(totalOutcomeAmountResult?.sum) || 0;
  //
  //   // Optimización 2: Obtener el conteo total de entradas directamente desde la BD
  //   const totalEntries = await this.entryService.repository
  //     .createQueryBuilder('entry')
  //     .leftJoin('entry.account', 'account')
  //     .leftJoin('account.user', 'user')
  //     .where('user.id = :userId', { userId: user.id })
  //     .andWhere('entry.createdAt BETWEEN :from AND :to', {
  //       from: new Date(period.from),
  //       to: new Date(period.to),
  //     })
  //     .getCount(); // Obtiene solo el conteo
  //
  //   console.log('tEntries', totalEntries);
  //
  //   // Optimización 3: Obtener el conteo de ingresos y egresos por separado para los porcentajes
  //   const incomeEntriesCount = await this.entryService.repository
  //     .createQueryBuilder('entry')
  //     .leftJoin('entry.type', 'type')
  //     .leftJoin('entry.account', 'account')
  //     .leftJoin('account.user', 'user')
  //     .where('user.id = :userId', { userId: user.id })
  //     .andWhere('entry.createdAt BETWEEN :from AND :to', {
  //       from: new Date(period.from),
  //       to: new Date(period.to),
  //     })
  //     .andWhere('type.name = :incomeType', {
  //       incomeType: EntryTypeEnum.Income.toString(),
  //     })
  //     .getCount();
  //
  //   const outcomeEntriesCount = await this.entryService.repository
  //     .createQueryBuilder('entry')
  //     .leftJoin('entry.type', 'type')
  //     .leftJoin('entry.account', 'account')
  //     .leftJoin('account.user', 'user')
  //     .where('user.id = :userId', { userId: user.id })
  //     .andWhere('entry.createdAt BETWEEN :from AND :to', {
  //       from: new Date(period.from),
  //       to: new Date(period.to),
  //     })
  //     .andWhere('type.name = :outcomeType', {
  //       outcomeType: EntryTypeEnum.Outcome.toString(),
  //     })
  //     .getCount();
  //
  //   // Evitar divisiones por cero si no hay entries
  //   // const baseForPercentage = totalEntries > 0 ? totalEntries : 1;
  //
  //   // Calculo de Totales e Porcentajes
  //   // const incomePercentage = (
  //   //   (incomeEntriesCount * 100) /
  //   //   baseForPercentage
  //   // ).toFixed(2);
  //   // const outcomePercentage = (
  //   //   (outcomeEntriesCount * 100) /
  //   //   baseForPercentage
  //   // ).toFixed(2);
  //
  //   const tIncome: TotalIncomeDto = {
  //     amount: this.roundToTwo(tIncomeAmount),
  //     entriesCount: incomeEntriesCount,
  //   };
  //
  //   const tOutcome: TotalOutcomeDto = {
  //     amount: this.roundToTwo(tOutcomeAmount),
  //     entriesCount: outcomeEntriesCount,
  //   };
  //
  //   // General Balance
  //   const gBalanceAmount = this.roundToTwo(tIncome.amount - tOutcome.amount);
  //   // const gBalancePer = (
  //   //   this.roundToTwo(Number(incomePercentage)) -
  //   //   this.roundToTwo(Number(outcomePercentage))
  //   // ).toFixed(2); // Asegurarse de redondear los porcentajes antes de restar
  //
  //   const gBalance: GeneralBalanceDto = {
  //     amount: gBalanceAmount,
  //     entriesCount: totalEntries,
  //     variantPercentage: '1111111111111111',
  //   };
  //
  //   // NoOfAccounts
  //   const noOfAccounts = await this.accountService.repository.count({
  //     where: { userId: user.id },
  //   });
  //
  //   // Result
  //   const result: GeneralInfoDto = {
  //     balance: gBalance,
  //     income: tIncome,
  //     outcome: tOutcome,
  //     noOfAccounts,
  //     noOfEntries: totalEntries, // Ahora obtenemos el conteo total directamente
  //   };
  //
  //   return result;
  // }

  async getGeneralInfoAsync(
    periodType: PeriodTypeEnum,
    user: User,
  ): Promise<GeneralInfoDto> {
    const period = GetPeriodByType(periodType)!;

    // 1. Una sola consulta para montos y conteos de ingresos y egresos
    const [summaryResult] = await this.entryService.repository
      .createQueryBuilder('entry')
      .select(
        'SUM(CASE WHEN type.name = :incomeType THEN entry.amount ELSE 0 END)',
        'totalIncomeAmount',
      )
      .addSelect(
        'SUM(CASE WHEN type.name = :outcomeType THEN entry.amount ELSE 0 END)',
        'totalOutcomeAmount',
      )
      .addSelect(
        'COUNT(CASE WHEN type.name = :incomeType THEN entry.id ELSE NULL END)',
        'incomeEntriesCount',
      )
      .addSelect(
        'COUNT(CASE WHEN type.name = :outcomeType THEN entry.id ELSE NULL END)',
        'outcomeEntriesCount',
      )
      .addSelect('COUNT(entry.id)', 'totalEntriesCount')
      .leftJoin('entry.type', 'type')
      .leftJoin('entry.account', 'account')
      .leftJoin('account.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('entry.createdAt BETWEEN :from AND :to', {
        from: new Date(period.from),
        to: new Date(period.to),
      })
      .setParameters({
        incomeType: EntryTypeEnum.Income.toString(),
        outcomeType: EntryTypeEnum.Outcome.toString(),
      })
      .getRawMany(); // getRawMany() porque usamos funciones de agregación

    const tIncomeAmount = Number(summaryResult?.totalIncomeAmount) || 0;
    const tOutcomeAmount = Number(summaryResult?.totalOutcomeAmount) || 0;
    const incomeEntriesCount = Number(summaryResult?.incomeEntriesCount) || 0;
    const outcomeEntriesCount = Number(summaryResult?.outcomeEntriesCount) || 0;
    const totalEntries = Number(summaryResult?.totalEntriesCount) || 0;

    // Obtener el balance total actual de todas las cuentas
    // const currentTotalAccountBalanceResult =
    //   await this.accountService.repository
    //     .createQueryBuilder('account')
    //     .select('SUM(account.balance)', 'totalBalance')
    //     .where('account.userId = :userId', { userId: user.id })
    //     .getRawOne();
    //
    // const currentTotalAccountBalance =
    //   Number(currentTotalAccountBalanceResult?.totalBalance) || 0;
    //
    // Obtener el conteo total de cuentas para el usuario
    const noOfAccounts = await this.accountService.repository.count({
      where: { userId: user.id },
    });

    // Calculo de Totales
    const tIncome: TotalIncomeDto = {
      amount: this.roundToTwo(tIncomeAmount),
      entriesCount: incomeEntriesCount,
    };

    const tOutcome: TotalOutcomeDto = {
      amount: this.roundToTwo(tOutcomeAmount),
      entriesCount: outcomeEntriesCount,
    };

    //
    const netBalanceForPeriod = tIncome.amount - tOutcome.amount;

    let variantPercentage = 0;
    let percentageBase = 0;

    if (netBalanceForPeriod > 0) {
      // If positive, percentage relative to total income
      percentageBase = tIncome.amount;
      if (percentageBase !== 0) {
        variantPercentage = (netBalanceForPeriod / percentageBase) * 100;
      } else {
        // If income is 0 but net balance is positive (shouldn't happen with this logic, but for robustness)
        variantPercentage = 0; // Or 100% if starting from 0 and gaining
      }
    } else if (netBalanceForPeriod < 0) {
      // If negative, percentage relative to total outcome
      percentageBase = Math.abs(tOutcome.amount); // Use absolute value of outcome
      if (percentageBase !== 0) {
        variantPercentage = (netBalanceForPeriod / percentageBase) * 100; // This will result in a negative percentage
      } else {
        variantPercentage = 0;
      }
    } else {
      // Net balance is 0
      variantPercentage = 0;
    }
    //
    // const netBalanceForPeriod = tIncome.amount - tOutcome.amount;
    //
    // // Calcular el balance al inicio del período
    // const balanceAtPeriodStart =
    //   currentTotalAccountBalance - netBalanceForPeriod;
    //
    // let variantPercentage = 0;
    // if (balanceAtPeriodStart !== 0) {
    //   // Calcula el porcentaje de cambio del balance neto del período
    //   // sobre el balance al inicio del período.
    //   variantPercentage = (netBalanceForPeriod / balanceAtPeriodStart) * 100;
    // } else if (netBalanceForPeriod !== 0) {
    //   // Si el balance al inicio del período era 0 y hubo cambios,
    //   // el porcentaje de crecimiento es indefinido o muy grande.
    //   // Podríamos representarlo como 100% si el netBalanceForPeriod es positivo
    //   // o un valor especial si es negativo. Para simplificar, si el inicio era 0
    //   // y ahora hay un balance, es un crecimiento "infinito" o lo máximo posible.
    //   // Aquí lo simplificamos a 100% si es positivo.
    //   variantPercentage = netBalanceForPeriod > 0 ? 100 : 0; // O manejarlo como desees
    // }

    const gBalance: GeneralBalanceDto = {
      amount: this.roundToTwo(netBalanceForPeriod),
      entriesCount: totalEntries,
      variantPercentage: `${this.roundToTwo(variantPercentage)}%`,
    };

    // Result
    const result: GeneralInfoDto = {
      balance: gBalance,
      income: tIncome,
      outcome: tOutcome,
      noOfAccounts: noOfAccounts,
      noOfEntries: tIncome.entriesCount + tOutcome.entriesCount,
    };

    return result;
  }

  private roundToTwo(number: number): number {
    const str = number.toFixed(2);
    return parseFloat(str);
  }
}
