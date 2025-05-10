import { useUser } from "../context/useUserContext";
import useFetch from "../hooks/useFetch";

export default function Grades() {
    const { user } = useUser();
    const data = useFetch(`${import.meta.env.VITE_API_URL}/grades/student/${user?.username}/subject/math`);

    return <>
        <div>List of Student's Grades</div>
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