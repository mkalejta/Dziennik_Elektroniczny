import useFetch from "../../hooks/useFetch";

export default function StudentDashboard() {
    const data = useFetch(`${import.meta.env.VITE_API_URL}/grades/student/student1/subject/math`);

    return <>
        <h2>Panel ucznia</h2>
        <p>Witaj w panelu ucznia!</p>
        <p>Tu znajdziesz wszystkie informacje dotyczące Twojego postępu w nauce.</p>
        <p>Możesz przeglądać oceny, frekwencję oraz inne ważne informacje.</p>

        <div className="card">
            <h3>Twoje oceny</h3>
            <div className="card-body">
                {data?.length > 0 && (
                    <ul>
                        {data.map((grade) => (
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
  