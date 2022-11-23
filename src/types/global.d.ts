// eslint-disable-next-line import/default
import React from 'react';

declare global {
  type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;

  interface File {
    preview: string;
  }
}
