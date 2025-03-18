//if one single event or is recurrent
export enum PlannedEntryFrecuencyEnum {
  ONE_TIME = 1,
  RECURRENT = 2,
}
//When the frecuency & recurrency ends
export enum PlannedEntryFrecuencyEndEnum {
  UNTIL_DATE = 1,
  NUMBER_OF_EVENTS = 2,
  FOREVER = 3,
}

//how often is repeated
export enum PlannedEntryRecurrencyEnum {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
  YEARLY = 4,
}
