export const sleep = async (timeout: number): Promise<void> => {
    return new Promise((r) => setTimeout(r, timeout));
};
