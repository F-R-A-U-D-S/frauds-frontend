import axiosClient from "../../api/axiosClient";
import type { DataProvider } from "react-admin";

const adminDataProvider: DataProvider = {
  // LIST
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const range = JSON.stringify([(page - 1) * perPage, page * perPage - 1]);
    const sort = JSON.stringify([field, order]);
    const filter = JSON.stringify(params.filter || {});

    const res = await axiosClient.get(
      `/${resource}?range=${range}&sort=${sort}&filter=${filter}`
    );

    return {
      data: res.data,
      total: parseInt(res.headers["content-range"].split("/")[1], 10),
    };
  },

  // GET ONE
  getOne: async (resource: string, params: any) => {
    const res = await axiosClient.get(`/${resource}/${params.id}`);
    return { data: res.data };
  },

  // CREATE
  create: async (resource: string, params: any) => {
    const res = await axiosClient.post(`/${resource}`, params.data);
    return { data: res.data };
  },

  // UPDATE
  update: async (resource: string, params: any) => {
    const res = await axiosClient.put(`/${resource}/${params.id}`, params.data);
    return { data: res.data };
  },

  // DELETE
  delete: async (resource: string, params: any) => {
    const res = await axiosClient.delete(`/${resource}/${params.id}`);
    return { data: res.data };
  },

  getMany: async () => {
    return { data: [] };
  },

  getManyReference: async () => {
    return { data: [], total: 0 };
  },

  updateMany: async () => {
    return { data: [] };
  },

  deleteMany: async () => {
    return { data: [] };
  },
};

export default adminDataProvider;
