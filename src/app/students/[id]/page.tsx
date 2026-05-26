import React from "react";
import StudentDetailPage from "@/components/student-details/StudentDetailPage";

export default function StudentDetail({
                                          params,
                                      }: Readonly<{ params: Promise<{ id: string }> }>) {
    const {id} = React.use(params);
    return <StudentDetailPage id={id}/>;
}
