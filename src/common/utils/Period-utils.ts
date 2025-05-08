import { PeriodDto } from '@common/dtos';
import { PeriodTypeEnum } from '@common/enums';

export const GetPeriodByType = (periodType: PeriodTypeEnum) => {
  let result: PeriodDto;
  switch (periodType) {
    case PeriodTypeEnum.TODAY:
      result = generateTodayFilter();
      break;
    case PeriodTypeEnum.WEEK:
      result = generateWeekFilter();
      break;
    case PeriodTypeEnum.MONTH:
      result = generateMonthFilter();
      break;
    case PeriodTypeEnum.YEAR:
      result = generateYearFilter();
      break;
  }

  return result;
};

const generateTodayFilter = (): PeriodDto => {
  const sDate: Date = new Date();
  sDate.setHours(0, 0, 0);

  const eDate: Date = new Date();
  eDate.setHours(23, 59, 59);
  return {
    from: dateToString(sDate),
    to: dateToString(eDate),
    type: PeriodTypeEnum.TODAY,
  };
};
const generateWeekFilter = (): PeriodDto => {
  const today = new Date();
  const sDate = new Date(today.setDate(today.getDate() - today.getDay()));
  sDate.setHours(0, 0, 0);

  const eDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  eDate.setHours(23, 59, 59);
  return {
    from: dateToString(sDate),
    to: dateToString(eDate),
    type: PeriodTypeEnum.WEEK,
  };
};
const generateMonthFilter = (): PeriodDto => {
  const today = new Date();
  const sDate = new Date(today.getFullYear(), today.getMonth(), 1);
  sDate.setHours(0, 0, 0);

  const eDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  eDate.setHours(23, 59, 59);

  return {
    from: dateToString(sDate),
    to: dateToString(eDate),
    type: PeriodTypeEnum.MONTH,
  };
};
const generateYearFilter = (): PeriodDto => {
  const today = new Date();
  const sDate = new Date(today.getFullYear(), 0, 1);

  sDate.setHours(0, 0, 0);

  const eDate = new Date(today.getFullYear(), 11, 31);
  eDate.setHours(23, 59, 59);

  return {
    from: dateToString(sDate),
    to: dateToString(eDate),
    type: PeriodTypeEnum.YEAR,
  };
};
const dateToString = (dt: Date) => {
  return dt.toUTCString();
};
