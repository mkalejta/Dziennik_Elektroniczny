import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";

export default function StudentDashboard() {
    const [grades, setGrades] = useState([]);
    const { keycloak } = useKeycloak();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/grades/student/student1/subject/math`, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${keycloak.token}`,
            }
            })
            .then(response => {
                setGrades(response.data);
            })
            .catch(error => {
                console.error("Error fetching grades:", error);
            });
    }, [keycloak]);

    console.log(grades);

    return <>
        <h2>Panel ucznia</h2>
        <p>Witaj w panelu ucznia!</p>
        <p>Tu znajdziesz wszystkie informacje dotyczące Twojego postępu w nauce.</p>
        <p>Możesz przeglądać oceny, frekwencję oraz inne ważne informacje.</p>

        <div className="card">
            <h3>Twoje oceny</h3>
            <div className="card-body">
                {grades.length > 0 && (
                    <ul>
                        {grades.map(grade => (
                            <li key={grade.id}>
                                {grade.subject.name}: {grade.grade} - {grade.teacher.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </>;
}
  