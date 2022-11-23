import Cookies from 'js-cookie';

const isAuthenticated = () => {
  if (Cookies.get('token') && Cookies.get('otpValid')) return true;
  return false;
};

const setToken = (token: string, rememberMe = false) => {
  Cookies.set('token', token, { expires: rememberMe ? 20 : 1 });
};

const getToken = () => Cookies.get('token');

const setTwilioToken = (twilioToken: string, rememberMe = false) => {
  Cookies.set('twilio-token', twilioToken, { expires: rememberMe ? 20 : 1 });
};

const getTwilioToken = () => Cookies.get('twilio-token');

const setUser = (userData: any) => {
  Cookies.set('userData', JSON.stringify(userData), { expires: 20 });
};

const getUser = () => {
  if (!Cookies.get('userData')) return null;

  return JSON.parse(Cookies.get('userData')!);
};

const clearCookies = () => {
  Cookies.remove('userData');
  Cookies.remove('token');
  Cookies.remove('twilio-token');
  Cookies.remove('otpToken');
  Cookies.remove('otpValid');
  Cookies.remove('resetToken');
};

const setOTPToken = (otpToken: string) => {
  Cookies.set('otpToken', otpToken);
};

const getOTPToken = () => Cookies.get('otpToken');

const setUserId = (userId: number) => {
  Cookies.set('userId', userId.toString());
};

const getUserId = () => Cookies.get('userId');

const setOTPValid = () => Cookies.set('otpValid', 'true');

const getOTPValid = () => Cookies.get('otpValid');

const setResetPasswordToken = (token: string) => {
  Cookies.set('resetToken', token);
};

const getResetPasswordToken = () => Cookies.get('resetToken');

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getUser,
  setUser,
  clearCookies,
  setToken,
  getToken,
  isAuthenticated,
  getOTPToken,
  setOTPToken,
  setOTPValid,
  getUserId,
  setUserId,
  getOTPValid,
  setResetPasswordToken,
  getResetPasswordToken,
  setTwilioToken,
  getTwilioToken,
};
