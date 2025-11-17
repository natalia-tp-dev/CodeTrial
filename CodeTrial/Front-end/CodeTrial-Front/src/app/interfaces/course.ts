import { Lesson } from "./lesson";

export interface Course {
    courseName: string,
    lessons: Lesson[]
}
