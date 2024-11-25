'use client';

import { createApi } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig } from 'axios';
import api from '@/lib/api/axios';

interface User {
  email: string;
  name: string;
}

interface AuthResponse {
  message: string;
  user: User;
}

// Custom baseQuery using axios
const axiosBaseQuery =
  (): BaseQueryFn<{
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
  }> =>
  async ({ url, method = 'GET', data }) => {
    try {
      const result = await api({ url, method, data });
      return { data: result };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message
        }
      };
    }
  };

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    checkAuth: builder.query<AuthResponse, void>({
      query: () => ({
        url: '/auth/authenticate'
      })
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'GET'
      })
    })
  })
});

export const { useCheckAuthQuery, useLogoutMutation } = authApi;
