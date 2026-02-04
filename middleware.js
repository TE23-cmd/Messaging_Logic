// next/serverからのインポートは不要です

export const config = {
  // この設定で、すべてのパスで認証が実行されます
  matcher: '/(.*)',
};

export default function middleware(request) {
  // 環境変数から設定したIDとパスワードを取得
  const basicAuth = request.headers.get('authorization');
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // Base64でエンコードされた文字列をデコード
    const [auth_user, auth_password] = atob(authValue).split(':');

    // IDとパスワードが一致するかチェック
    if (auth_user === user && auth_password === password) {
      // 一致すれば、リクエストをそのまま通し、ページへのアクセスを許可
      return; 
    }
  }
  
  // 一致しない、または認証情報がない場合は、認証を要求する
  // ここではNextResponseではなく、標準のResponseオブジェクトを使います
  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
