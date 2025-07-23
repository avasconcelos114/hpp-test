import { object, string } from 'yup';

export const payInPageSchema = object({
  uuid: string().uuid().required(),
});
