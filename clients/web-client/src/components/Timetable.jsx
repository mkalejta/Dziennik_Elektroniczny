import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'subject', headerName: 'Subject', width: 130 },
  { field: 'teacher', headerName: 'Teacher', width: 130 },
  { field: 'time', headerName: 'Time', width: 150 },
];

const rows = [
  { id: 1, subject: 'Math', teacher: 'Mr. Smith', time: '08:00 - 08:45' },
  { id: 2, subject: 'Physics', teacher: 'Ms. Doe', time: '09:00 - 09:45' },
  { id: 3, subject: 'English', teacher: 'Mr. Johnson', time: '10:00 - 10:45' },
];

export default function Timetable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
}
