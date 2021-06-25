export async function responseToString(response: Response): Promise<string> {
    return `${response.statusText} (${response.status}): ${await response.json()}`;
}
