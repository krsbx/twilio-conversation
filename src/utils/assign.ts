import _ from 'lodash';
import { Control, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';

export const reassignRegisterControl = (
  originalRegister: UseFormRegister<any>,
  control: Control<any>,
  cb?: ({ name, value }: { name: string; value: boolean | number | string }) => void,
  isSetControl = true
) => {
  const register = (name: string): UseFormRegisterReturn => {
    const registerObj = originalRegister(name);
    const onChange = registerObj.onChange.bind(registerObj);

    registerObj.onChange = async (event) => {
      let value: boolean | number | string = event.target.value;

      if (_.isBoolean(value)) {
        value = Boolean(value);
      } else if (_.isNumber(value) && !_.isNaN(+value)) {
        value = +value;
      }

      onChange(event);

      cb?.({ name, value });
    };

    return registerObj;
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (isSetControl) control.register = register;

  return register;
};
