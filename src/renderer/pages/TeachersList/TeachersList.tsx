import { Box, Paper } from "@mui/material";
import "./TeachersList.css"

function TeachersList()
{
    const teachers: string[] = JSON.parse(localStorage.getItem("teachers") ?? "[]").teacher
    let elements: JSX.Element[] = []

    for (let i = 0; i < teachers.length; i++)
    {
        elements.push(
            <div className={"teachers-list__teacher " + (i%2 == 0 ? "" : "teachers-list__teacher--second")}>
                {teachers[i]}
            </div>
        )
    }

    return (
        <Paper className="absolute-center teachers-list">
            {elements}
        </Paper>
    );
}

export default TeachersList;