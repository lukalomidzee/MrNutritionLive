import React from "react";
import StudentDetailPage from "@/components/student-details/StudentDetailPage";

export function generateStaticParams() {
    return [
        { id: "mariam-gelashvili" },
        { id: "dato-kapanadze" },
    ];
}

export default function StudentDetail({
                                          params,
                                      }: Readonly<{ params: Promise<{ id: string }> }>) {
    const {id} = React.use(params);
    return <StudentDetailPage id={id}/>;
}
