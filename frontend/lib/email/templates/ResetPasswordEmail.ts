interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>パスワードのリセット</title>
      </head>
      <body style="
        background-color: #f6f9fc;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
        margin: 0;
        padding: 0;
      ">
        <div style="
          background-color: #ffffff;
          margin: 32px auto;
          padding: 40px;
          max-width: 600px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          <h1 style="
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
            text-align: center;
          ">パスワードのリセット</h1>
          
          <p style="
            font-size: 16px;
            line-height: 24px;
            color: #333;
            margin-bottom: 16px;
            text-align: center;
          ">${name}様</p>
          
          <p style="
            font-size: 16px;
            line-height: 24px;
            color: #333;
            margin-bottom: 16px;
            text-align: center;
          ">パスワードリセットのリクエストを受け付けました。以下のボタンをクリックして、新しいパスワードを設定してください。</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="
              background-color: #3B82F6;
              border-radius: 4px;
              color: #ffffff;
              display: inline-block;
              font-size: 16px;
              text-decoration: none;
              padding: 12px 24px;
            ">パスワードをリセット</a>
          </div>
          
          <p style="
            font-size: 16px;
            line-height: 24px;
            color: #333;
            margin-bottom: 16px;
            text-align: center;
          ">このメールに心当たりがない場合は、無視していただいて構いません。</p>
        </div>
      </body>
    </html>
  `;
}
