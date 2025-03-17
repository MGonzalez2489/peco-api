//if one single event or is recurrent
export enum PlannedEntryFrecuencyEnum {
  ONE_TIME = 'One Time',
  RECURRENT = 'Recurrent',
}
//When the frecuency & recurrency ends
export enum PlannedEntryFrecuencyEndEnum {
  UNTIL_DATE = 'Until Date',
  NUMBER_OF_EVENTS = 'Number of Events',
  FOREVER = 'Forever',
}

//how often is repeated
export enum PlannedEntryRecurrencyEnum {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}
