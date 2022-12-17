import { number, object, string } from "yup";
import { atom } from "recoil";
import { axiosInstance } from "../api";

const isClientSide = () => typeof window !== "undefined";

const ACCESS_TOKEN_KEY = "access_token";

const tokenStorage = {
  get() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  remove() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

const validatePayload = object({
  exp: number().required(),
});

const validateHeader = object({
  alg: string(),
  typ: string().oneOf(["JWT"]),
});

const safeDecodeAccessToken = (token: string) => {
  try {
    const matches = token.match(/^(.+)\.(.+)\.(.+)$/);
    if (!matches) {
      return null;
    }

    const jwtHeader = JSON.parse(window.atob(matches[1])) as unknown;
    const jwtPayload = JSON.parse(window.atob(matches[2])) as unknown;

    const header = validateHeader.validateSync(jwtHeader);
    const payload = validatePayload.validateSync(jwtPayload);

    const exp = payload.exp;

    if (exp < Date.now() / 1000) {
      return null;
    }

    return { header, payload };
  } catch {
    return null;
  }
};

export const accessTokenAtom = atom<string | null>({
  key: "accessToken",
  default: null,
  effects: [
    ({ setSelf, onSet }) => {
      if (isClientSide()) {
        const token = tokenStorage.get();
        if (token !== null && safeDecodeAccessToken(token)) {
          setSelf(token);
          axiosInstance.defaults.headers.common["Authorization"] = token;
        }
      }

      onSet((token, _, isReset) => {
        if (isReset || token === null) {
          tokenStorage.remove();
          return;
        }
        tokenStorage.set(token);

        axiosInstance.defaults.headers.common["Authorization"] = token;
      });
    },
  ],
});
