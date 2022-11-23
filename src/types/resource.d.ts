export type User = {
  id: number;
  firstname: string;
  middlename: string;
  surname: string;
  email: string;
  gender: 'male' | 'female';
  profilePictureId: null | number;
  driver: any;
  twilioUserSid: null | string;
};
