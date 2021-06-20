export async function responseToString(response: Response) {
    return `${response.statusText} (${response.status}): ${await response.json()}`;
}