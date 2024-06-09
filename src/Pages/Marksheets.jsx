import { useEffect, useState } from "react"
import { NavBarr } from "../Components/NavBarr"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"

const Marksheets = () => {
    const [employee, setEmployee] = useState([])
    const [marksheetdata, setMarksheetdata] = useState([])
    const nav = useNavigate()

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {
        try {
            const res = await axios.get('http://localhost:5500/getemployeedetails')
            if (res.data.Token) {
                setEmployee(res.data.EmployeeDetails)
                const response = await axios.get('http://localhost:5500/getmarksheets')
                setMarksheetdata(response.data.MarksheetData)

            }
            else {
                localStorage.clear()
                nav('/')
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [])

    return (


        employee.length === 0 ?
            <NavBarr />
            :
            <>
                <NavBarr dp={employee[0].ProfilePic} />
                <br />
                <br />
                <br />
                {
                    marksheetdata.map((ms) => (
                        <>
                            <Button onClick={() => window.open(ms.Path)} variant="contained">View {ms.DegreeName} Marksheet</Button>
                            <br />
                            <br />
                        </>
                    ))
                }
            </>



    )
}

export { Marksheets }