// Usecase for this storage has no confidential information and thus encryption with secretKey is not requierd
const key = 'input_data';

export type InputData = {
    students: number;
    submissions: number;
    description: string;
    dueDate: string;
}

export const setLocalStorageItem = (value: any) => {
    const stringVal = JSON.stringify(value);
    console.log(stringVal);
    localStorage.setItem(key, stringVal);
};

export const getLocalStorageItem = () => {
    const stringVal = localStorage.getItem(key);

    // Check if its the first time initializing (NULL if true)
    if (stringVal) {
        const json_data = JSON.parse(stringVal);
        return json_data;
    }
    return null;
}
