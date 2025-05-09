import React, { useState, useEffect } from "react";
import { useUser } from "../context/useUserContext";

const studentFields = [
    { name: "profile", nav: "/profile" },
    { name: "grades", nav: "/grades" },
    { name: "timetable", nav: "/timetable" }
];

const parentFields = [
    { name: "profile", nav: "/profile" },
    { name: "grades", nav: "/grades" },
    { name: "attendance", nav: "/attendance" },
    { name: "messages", nav: "/messages" }
];

const teacherFields = [
    { name: "profile", nav: "/profile" },
    { name: "subjects", nav: "/subjects" },
    { name: "attendance", nav: "/attendance" },
    { name: "timetable", nav: "/timetable" },
    { name: "messages", nav: "/messages" }
];

export default function Navbar () {
    const [fields, setFields] = useState([]);
    const { user } = useUser();
    const role = user?.role;

    useEffect(() => {
        if (role === "student") setFields(studentFields)
        else if (role === "parent") setFields(parentFields)
        else if (role === "teacher") setFields(teacherFields)
    }, [role]);

    return (
        <div className="content">
            {fields.map((field) => (
                <div key={field.nav} className="field">
                    <a href={field.nav}>{field.name}</a>
                </div>
            ))}
        </div>
    );
}