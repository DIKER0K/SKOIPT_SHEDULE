import { useSearchParams } from "react-router-dom";
import { motion } from 'framer-motion';
import "./ViewTeacherSchedule.css";
import "../../App.css"
import { Paper } from "@mui/material";



export default function ViewTeacherSchedule()
{
    const [searchParams] = useSearchParams();
    const teacher = searchParams.get("teacher") ?? "";
    let scheduleEl: JSX.Element[][][] = [];
    let schedule: string[][][];

    let schedules = JSON.parse(localStorage.getItem('schedules') ?? '0');

    if (schedules.teachers[teacher] == null)
    {
        schedule = schedules.teachers[teacher]
    }
    else
    {
        
    }
    
    // parse 
    //for (let day = 0; day < schedule.length; day++)
    //{
    //    let dayEl: JSX.Element[] = []
    //    for (let lesson = 0; lesson < schedule[day].length; lesson++)
    //    {
    //        
    //    }
    //}


    return (
        <motion.div
          initial={{ opacity: '0' }}
          animate={{ opacity: '1' }}
          exit={{ opacity: '0' }}
          transition={{ type: 'spring', stiffness: 50, delay: 0.1 }}
        >
            <Paper 
                className="absolute-center"
                sx={{
                    borderBottomRightRadius: "0px",
                    borderBottomLeftRadius: "0px"
                }}
            >
                <div className="ViewTeacher">
                    <div className="ViewTeacher__container">
                        {scheduleEl}
                    </div>
                </div>
            </Paper>
        </motion.div>
    )
}