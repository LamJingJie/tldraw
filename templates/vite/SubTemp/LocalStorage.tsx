// Usecase for this storage has no confidential information and thus encryption with secretKey is not requierd
const key = 'input_data';
const key2 = 'student_list_data';

export type InputData = {
    students: number;
    submissions: number;
    description: string;
    dueDate: string;
}

// Default
let input_fields: InputData = {
    students: 1,
    submissions: 1,
    description: 'Description',
    dueDate: 'DueDate',
}




// InputData
export const setLocalStorageItem_input = (value: any) => {
    const stringVal = JSON.stringify(value);
    localStorage.setItem(key, stringVal);
};

export const getLocalStorageItem_input = (): InputData => {
    const stringVal = localStorage.getItem(key);
    return stringVal ? JSON.parse(stringVal) : input_fields;
}



// StudentListData
export const setLocalStorageItem_student_list = (value: any) => {
    const stringVal = JSON.stringify(value);
    localStorage.setItem(key2, stringVal);
};

export const getLocalStorageItem_student_list = (): string[] => {
    const stringVal = localStorage.getItem(key2);
    return stringVal ? JSON.parse(stringVal) : [];

};