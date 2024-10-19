import { Box, Paper } from "@mui/material";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import "./TeachersList.css"

function TeachersList()
{
    const navigate = useNavigate();
    const teachers: string[] = JSON.parse(localStorage.getItem("teachers") ?? "[]").teacher
    let elements: JSX.Element[] = []

    for (let i = 0; i < teachers.length; i++)
    {
        elements.push(
            <div 
                className={"teachers-list__teacher " + (i%2 == 0 ? "" : "teachers-list__teacher--second")} 
                onClick={() => navigate(`/view?group=${teachers[i]}`)}
            >
                {teachers[i]}
            </div>
        )
    }

    return (
        <Box className="absolute-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0, y: 500 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: -500 }}
                transition={{ type: 'spring', stiffness: 50 }}
                >
                    <Paper className="teachers-list">
                        {elements}
                    </Paper>
            </motion.div>
        </Box>
    );
}

export default TeachersList;