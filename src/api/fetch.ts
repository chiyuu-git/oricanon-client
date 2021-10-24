/**
 * @file 对原生fetch进行包装 方便使用
 */

type FetchMethod = 'GET' | 'POST';
type FetchParam = Record<string | number | symbol, unknown>;

/**
 * 返回一个promise，外部可以通过then在获取到数据后再继续操作
 *
 * @param requestUrl
 * @param method
 * @param params
 * @returns Promise
 */
export async function enhanceFetch(
    requestUrl = '',
    params: FetchParam = {},
    method: FetchMethod = 'GET',
) {
    let url = requestUrl;

    let response: Response;

    // 无论是GET还是POST都需要拼接参数
    let query = '';
    for (const [key, value] of Object.entries(params)) {
        query += `${key}=${value}&`;
    }
    // 去除最后一个 &
    if (query) {
        query = query.slice(0, -1);
    }

    if (method === 'GET' && query) {
        url += `?${query}`;
    }

    console.log(method, params, url);

    // 不同的请求不同的fetch
    try {
        switch (method) {
            case 'GET':
                response = await fetch(url);
                break;
            case 'POST':
                response = await fetch(url, {
                    method,
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    },
                    body: query,
                    mode: 'cors',
                });
                break;
            default:
        }
    }
    catch (error) {
        console.log('Request Error:', error);
    }

    return response!.json();
}
