import {dlog} from './AppConfig';

export class AppServerClient {
  private static _regUrl: string =
    'https://a41.easemob.com/app/chat/user/register';
  private static _tokenUrl: string =
    'https://a41.easemob.com/app/chat/user/login';

  protected _(): void {}

  private static async req2(params: {
    userId: string;
    userPassword: string;
    from: 'registerAccount' | 'getAccountToken';
    onResult: (params: {data?: any; error?: any}) => void;
  }): Promise<void> {
    try {
      let url = '';
      if (params.from === 'getAccountToken') {
        url = AppServerClient._tokenUrl;
      } else if (params.from === 'registerAccount') {
        url = AppServerClient._regUrl;
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAccount: params.userId,
          userPassword: params.userPassword,
        }),
      });
      const value = await response.json();
      dlog.log('test:value:', url, value, value.code);
      if (value.code === 'RES_0K' || value.code === 'RES_OK') {
        if (params.from === 'getAccountToken') {
          params.onResult({data: {token: value.accessToken}});
        } else if (params.from === 'registerAccount') {
          params.onResult({data: {}});
        }
      } else {
        params.onResult({error: {code: value.code}});
      }
    } catch (error) {
      params.onResult({error});
    }
  }

  public static registerAccount(params: {
    userId: string;
    userPassword: string;
    onResult: (params: {data?: any; error?: any}) => void;
  }): void {
    this.req2({...params, from: 'registerAccount'});
  }

  public static getAccountToken(params: {
    userId: string;
    userPassword: string;
    onResult: (params: {data?: any; error?: any}) => void;
  }): void {
    this.req2({...params, from: 'getAccountToken'});
  }

  public static set regUrl(url: string) {
    AppServerClient._regUrl = url;
  }
  public static set tokenUrl(url: string) {
    AppServerClient._tokenUrl = url;
  }
}
