import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { NavBarr } from "../Components/NavBarr"

export const Home = () => {
    const nav = useNavigate()
    const [employee, setEmployee] = useState([])
    const [dp, setDp] = useState("")

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        try {
            const res = await axios.get("http://localhost:5500/getemployeedetails")
            if (!res.data.Token) {
                localStorage.clear()
                toast("You are not logged In")
                nav('/')
            }
            else {
                if (JSON.parse(localStorage.getItem('User'))[0].Role === "employee") nav('/dashboard')
                else {
                    setEmployee(res.data.EmployeeDetails)
                    setDp(res.data.EmployeeDetails[0].ProfilePic)
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    })

    const viewMarksheet = (path) => window.open(path)

    return (
        <>
            <NavBarr login={false} dp={dp} />
            {
                employee.length === 0 ?
                    <>Loading...</>
                    :
                    employee.map((emp) => (
                        <div className="tbl" style={{ display: "flex", justifyContent: "center" }}>

                            <table border={1} style={{ marginTop: "5%" }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>D.O.B</th>
                                        <th>Gender</th>
                                        <th>Marital Status</th>
                                        <th>Nationality</th>
                                        <th colSpan={3}>Experience</th>
                                        <th>Contact</th>
                                        <th>Email</th>
                                        <th>Skills</th>
                                        <th colSpan={emp.Qualification.length}>Qualification</th>
                                        <th>Avatar</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{emp.Name}</td>
                                        <td>{emp.Age}</td>
                                        <td>{emp.DOB}</td>
                                        <td>{emp.Gender}</td>
                                        <td>{emp.MaritalStatus}</td>
                                        <td>{emp.Nationality}</td>
                                        <td><p>Years: {emp.Experience.Years}</p></td>
                                        <td><p>Months: {emp.Experience.Months}</p></td>
                                        <td><p>Total Years: {emp.Experience.TotalExperience}</p></td>
                                        <td>{emp.Contact}</td>
                                        <td>{emp.Email}</td>
                                        <td>{emp.Skills}</td>

                                        {emp.Qualification.map((qual) => (
                                            <td>Degree: {qual.Degree}, Completed On:{qual.CompletedOn}, Percentage: {qual.Percentage}, Marksheet: <button onClick={() => viewMarksheet(qual.Marksheet)}>View Marksheet</button></td>
                                        ))}

                                        <td><img src={emp.ProfilePic} alt="" style={{ width: "60px", borderRadius: "100px" }} /></td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))
            }
        </>
    )
}