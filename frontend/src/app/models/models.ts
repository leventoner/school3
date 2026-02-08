export enum Course {
    COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
    PROGRAMMING = "PROGRAMMING",
    DATA_SCIENCE = "DATA_SCIENCE",
    ARTIFICIAL_INTELLIGENCE = "ARTIFICIAL_INTELLIGENCE",
    CYBER_SECURITY = "CYBER_SECURITY",
    WEB_DEVELOPMENT = "WEB_DEVELOPMENT",
    MOBILE_DEVELOPMENT = "MOBILE_DEVELOPMENT",
    SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING",
    NETWORKING = "NETWORKING",
    CLOUD_COMPUTING = "CLOUD_COMPUTING"
}

export enum Grade {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E"
}

export enum StudentClass {
    C1A = "1A",
    C1B = "1B",
    C2A = "2A",
    C2B = "2B",
    C3A = "3A",
    C3B = "3B",
    C4A = "4A",
    C4B = "4B"
}

export interface Student {
    id?: number;
    firstName: string;
    lastName: string;
    schoolNumber: string;
    birthDate: string;
    studentClass: string;
    courses: Record<string, string>;
}

export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    token: string;
}

export interface Teacher {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
}

export interface Classroom {
    id?: number;
    roomNumber: string;
    capacity: number;
    roomType: string;
    floor: number;
}

export interface Book {
    id?: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    status: string;
}

export interface Attendance {
    id?: number;
    studentId: number;
    date: string;
    status: string;
}

export interface StudentGrade {
    id?: number;
    studentId: number;
    subject: string;
    score: number;
    examDate: string;
}
