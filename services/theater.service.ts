// services/theater.service.ts
import { TheaterModel } from "../models/theater";

export const getTheaterById = async (id: string) => {
  return await TheaterModel.findById(id).lean();
};

export const getAllTheaters = async () => {
  return await TheaterModel.find().lean();
};
