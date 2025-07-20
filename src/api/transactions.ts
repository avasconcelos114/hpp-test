import { axiosInstance } from './axios-instance';
import { UpdateTransactionSummaryRequest } from '@/lib/types/transactions';

export const getTransactionSummary = async (uuid: string) => {
  const response = await axiosInstance.get(`/api/v1/pay/${uuid}/summary`);
  return response.data;
};

export const updateTransactionSummary = async (
  uuid: string,
  request: UpdateTransactionSummaryRequest,
) => {
  const response = await axiosInstance.put(
    `/api/v1/pay/${uuid}/update/summary`,
    request,
  );
  return response.data;
};

export const refreshQuote = async (uuid: string) => {
  const response = await axiosInstance.put(`/api/v1/pay/${uuid}/summary`);
  return response.data;
};

export const acceptQuote = async (uuid: string) => {
  const response = await axiosInstance.put(
    `/api/v1/pay/${uuid}/accept/summary`,
  );
  return response.data;
};
