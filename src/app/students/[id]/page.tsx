import React from "react";
import StudentDetailPage from "@/components/student-details/StudentDetailPage";
import { mockStudents } from "@/components/backend/mockData";

export function generateStaticParams() {
    return mockStudents.map((student) => ({ id: student.id }));
}

export default function StudentDetail({
                                          params,
                                      }: Readonly<{ params: Promise<{ id: string }> }>) {
    const {id} = React.use(params);
    return <StudentDetailPage id={id}/>;
}
