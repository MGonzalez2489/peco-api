import { ColorEnum } from '@common/enums';

export const CatSeedData = [
  {
    name: 'Comida y Bebidas',
    color: ColorEnum.RED,
    icon: 'pi pi-question-circle',
    forTypeId: 'outcome',
    subCategories: [
      {
        name: 'Bar, cafe',
        color: ColorEnum.RED,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Groceries',
        color: ColorEnum.RED,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Restaurant, fast-food',
        color: ColorEnum.RED,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
    ],
  },
  {
    name: 'Compras',
    color: ColorEnum.BLUE,
    forTypeId: 'outcome',
    icon: 'pi pi-question-circle',
    subCategories: [
      {
        name: 'Ropa y Zapatos',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Farmacia',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Electronicos',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Tiempo Libre',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Regalos',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Salud y Belleza',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Casa y Jardin',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Joyeria',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Niños',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Mascotas',
        color: ColorEnum.BLUE,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
    ],
  },
  {
    name: 'Casa',
    color: ColorEnum.YELLOW,
    icon: 'pi pi-question-circle',
    forTypeId: 'outcome',
    subCategories: [
      {
        name: 'Servicios',
        color: ColorEnum.YELLOW,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Mantenimiento',
        color: ColorEnum.YELLOW,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Renta',
        color: ColorEnum.YELLOW,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Seguro de vivienda',
        color: ColorEnum.YELLOW,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
      {
        name: 'Hipoteca',
        color: ColorEnum.YELLOW,
        forTypeId: 'outcome',
        icon: 'pi pi-question-circle',
      },
    ],
  },
  {
    name: 'Ingresos',
    color: ColorEnum.FUCHSIA,
    icon: 'pi pi-question-circle',
    forTypeId: 'income',
    subCategories: [
      {
        name: 'Cheques y cupones',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
      {
        name: 'Regalos',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
      {
        name: 'Intereses, dividendos',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
      {
        name: 'Rentas',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
      {
        name: 'Loteria',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
      {
        name: 'Reembolsos',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
      {
        name: 'Salario',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
      {
        name: 'Ventas',
        color: ColorEnum.FUCHSIA,
        icon: 'pi pi-question-circle',
        forTypeId: 'income',
      },
    ],
  },
  {
    name: 'Otros',
    color: ColorEnum.GRAY,
    forTypeId: 'outcome',
    icon: 'pi pi-question-circle',
    subCategories: [],
  },
];
