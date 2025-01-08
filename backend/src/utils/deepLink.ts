import { Context } from "hono";

// 環境に応じたスキームを取得
const getScheme = (c: Context) => {
  const isDev = c.env.WORKER_ENV === "development"; // 環境変数名をWORKER_ENVに変更
  if (isDev) {
    return "exp";
  }
  return "myapp";
};

// URLを生成する関数
export const createDeepLink = (
  c: Context,
  path: string,
  params: Record<string, string>
) => {
  const scheme = getScheme(c);
  const queryString = new URLSearchParams(params).toString();

  if (c.env.WORKER_ENV === "development") {
    // 環境変数名をWORKER_ENVに変更
    return `${c.env.APP_URL}/--/${path}?${queryString}`;
  }

  // 本番環境: myapp://callback?token=abc
  return `${scheme}://${path}?${queryString}`;
};
