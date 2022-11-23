import { saveAs } from 'file-saver';
import axios, { AxiosRequestConfig } from 'axios';

export const saveFile = (data: Blob, fileName?: string | null) => saveAs(data, fileName ?? '');

export const downloadBlob = async (url: string, headerConfig?: AxiosRequestConfig<any>) => {
  const { data } = await axios.get<Blob>(url, {
    responseType: 'blob',
    ...headerConfig,
  });

  return data;
};
