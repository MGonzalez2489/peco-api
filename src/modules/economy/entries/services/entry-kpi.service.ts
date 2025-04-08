import { AccountService } from '@accounts/services/account.service';
import { EntryTypeEnum } from '@catalogs/enums';
import { Entry } from '@datasource/entities/economy';
import { EntryKPIRequestDto, EntryKPIResponseDto } from '@entries/dtos';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

interface KPIData {
  label: string;
  values: Entry[];
  total: number;
}

@Injectable()
export class EntryKpiService {
  constructor(
    @InjectRepository(Entry) private readonly repository: Repository<Entry>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

  async generateEntriesKPI(
    dto: EntryKPIRequestDto,
  ): Promise<EntryKPIResponseDto> {
    // 1. Obtener la cuenta (si se proporciona)
    const account = dto.accountId
      ? await this.accountService.getAccountByPublicIdAsync(dto.accountId)
      : undefined;

    // 2. Construir el filtro para la consulta
    const filter: Record<string, any> = {};
    if (account) {
      filter.accountId = account.id;
    }

    // 3. Obtener las entradas filtradas desde la base de datos
    const entries = await this.repository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.type', 'type')
      .where(filter)
      .andWhere({
        createdAt: MoreThanOrEqual(new Date(dto.from)),
      })
      .andWhere({
        createdAt: LessThanOrEqual(new Date(dto.to)),
      })
      .orderBy(`entry.createdAt`, 'ASC')

      .getMany();

    let response: EntryKPIResponseDto = {
      labels: [],
      datasets: [
        {
          label: 'Sin definicion',
          data: [],
        },
      ],
      period: dto.type,
    };

    //crear diccionarios. key = label, values
    switch (dto.type) {
      case 'TODAY':
        response = this.processEntriesByToday(entries);
        break;
      case 'WEEK':
        response = this.processEntriesByWeek(entries);
        break;

      case 'MONTH':
        response = this.processEntriesByMonth(entries);
        break;
      case 'YEAR':
        response = this.processEntriesByYear(entries);
        break;

      default:
        break;
    }

    response.period = dto.type;

    return response;
  }

  private processEntriesByYear(entries: Entry[]) {
    const today = new Date(Date.now());
    const currentMonth = today.getMonth();

    const data: KPIData[] = [];

    for (let i = 0; i <= currentMonth; i++) {
      const ent = entries.filter((f) => new Date(f.createdAt).getMonth() === i);
      if (ent.length > 0) {
        data.push({
          label: new Date(ent[0].createdAt).getMonth().toString(),
          values: ent,
          total: 0,
        });
      }
    }

    data.forEach((d) => {
      d.total = d.values.reduce((sum, entry) => {
        return entry.type.name === EntryTypeEnum.Income
          ? sum + Number(entry.amount)
          : sum - Number(entry.amount);
      }, d.total);
    });

    const response: EntryKPIResponseDto = {
      labels: data.map((f) => f.label),
      datasets: [
        {
          label: 'Datos de este año',
          data: data.map((f) => f.total),
        },
      ],
      period: 'Year',
    };
    return response;
  }

  private processEntriesByToday(entries: Entry[]) {
    const roundedEntries = entries.map((entry) => {
      const date = new Date(entry.createdAt);
      const minutes = date.getUTCMinutes();
      let hour = date.getUTCHours();

      if (minutes >= 30) {
        hour++;
      }

      date.setUTCHours(hour, 0, 0, 0); // Establecer horas y minutos
      return {
        ...entry,
        createdAt: date.toUTCString(),
      };
    });

    let dates = roundedEntries.map((f) => f.createdAt);
    dates = [...new Set(dates)];
    const data: KPIData[] = [];
    dates.forEach((d) => {
      data.push({
        label: d,
        values: roundedEntries.filter((f) => f.createdAt === d),
        total: 0,
      });
    });

    data.forEach((d) => {
      d.total = d.values.reduce((sum, entry) => {
        return entry.type.name === EntryTypeEnum.Income
          ? sum + Number(entry.amount)
          : sum - Number(entry.amount);
      }, d.total);
    });

    const response: EntryKPIResponseDto = {
      labels: data.map((f) => f.label),
      datasets: [
        {
          label: 'Datos de hoy',
          data: data.map((f) => f.total),
        },
      ],
      period: 'TODAY',
    };
    return response;
  }
  //recuerda que ya vienen filtrados por fecha de creacion y no hay creaciones futuras
  private processEntriesByWeek(entries: Entry[]) {
    const roundedEntries = entries.map((f) => {
      return {
        ...f,
        createdAt: new Date(f.createdAt).toDateString(),
      };
    });
    //get dates
    let dates = roundedEntries.map((f) => f.createdAt);
    //
    dates = [...new Set(dates)];

    const data: KPIData[] = [];

    dates.forEach((d) => {
      data.push({
        label: d,
        values: roundedEntries.filter((f) => f.createdAt === d),
        total: 0,
      });
    });
    data.forEach((d) => {
      d.total = d.values.reduce((sum, entry) => {
        return entry.type.name === EntryTypeEnum.Income
          ? sum + Number(entry.amount)
          : sum - Number(entry.amount);
      }, d.total);
    });
    const response: EntryKPIResponseDto = {
      labels: data.map((f) => f.label),
      datasets: [
        {
          label: 'Datos de esta semana',
          data: data.map((f) => f.total),
        },
      ],
      period: 'WEEK',
    };
    return response;
  }

  private processEntriesByMonth(entries: Entry[]) {
    const roundedEntries = entries.map((f) => {
      return {
        ...f,
        week: this.getWeekOfMonth(new Date(f.createdAt)),
      };
    });
    let weeks = roundedEntries.map((f) => f.week);
    weeks = [...new Set(weeks)];

    const data: KPIData[] = [];
    weeks.forEach((w) => {
      data.push({
        label: 'week ' + w,
        values: roundedEntries.filter((f) => f.week === w),
        total: 0,
      });
    });
    data.forEach((d) => {
      d.total = d.values.reduce((sum, entry) => {
        return entry.type.name === EntryTypeEnum.Income
          ? sum + Number(entry.amount)
          : sum - Number(entry.amount);
      }, d.total);
    });
    const response: EntryKPIResponseDto = {
      labels: data.map((f) => f.label),
      datasets: [
        {
          label: 'Datos del mes',
          data: data.map((f) => f.total),
        },
      ],
      period: 'MONTH',
    };
    return response;
  }

  private getWeekOfMonth(fecha: Date): number {
    const primerDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const primerDiaDeLaSemana = primerDiaDelMes.getDay(); // 0 (Domingo) - 6 (Sábado)

    let diaDelMes = fecha.getDate();
    diaDelMes += primerDiaDeLaSemana; // Ajustar por el primer día de la semana

    return Math.ceil(diaDelMes / 7);
  }
}
