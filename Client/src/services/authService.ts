import type { LoginDto, RegisterDto, ResponseTokenDto } from "../dtos/authDtos";
import api from "../api";

export const authService = {
  login: async (data: LoginDto) => {
    return api.post<ResponseTokenDto>("/auth/login", data).then((res) => res.data);
  },

  register: (data: RegisterDto) =>
    api.post("/auth/register", data),
};
