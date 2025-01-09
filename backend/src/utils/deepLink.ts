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
    // exp://をhttps://に置き換える
    const httpsUrl = c.env.APP_URL.replace("exp://", "https://");
    return `${httpsUrl}/--/${path}?${queryString}`;
  }

  return `${scheme}://${path}?${queryString}`;
};
