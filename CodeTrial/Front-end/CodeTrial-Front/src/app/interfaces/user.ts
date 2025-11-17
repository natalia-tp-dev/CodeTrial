import { Course } from "./course";

export interface User {
    _id: number,
    firstName: string,
    lastName: string,
    email: string,
    courses: Course[]
}
