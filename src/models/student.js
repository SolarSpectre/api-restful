import bcrypt from "bcrypt"

const studentModel = {


    async registerStudentModel (newUser) {
        const url = "https://communities.free.beeceptor.com/students"
        const peticion = await fetch(url,{
            method:'POST',
            body:JSON.stringify(newUser),
            headers:{'Content-Type':'application/json'}
        })
        const data = await peticion.json()
        return data
    },

    async loginStudentModel(username,password) {
        const response = await fetch(`https://communities.free.beeceptor.com/students`)
        const users = await response.json()
        const user = users.find(user => user.username === username)
        if (!user) {
            return { error: "Username o password invalido" }
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (user && passwordMatch) {
            return user
        } else {
            return {error:"Username o password invalido"}
        }
    },
    async updateStudent_model(studentID, updateStudent_model){
        const url=`https://communities.free.beeceptor.com/students/${studentID}`
        const peticion=await fetch(url, {
            method: "PUT",
            body: JSON.stringify(updateStudent_model),
            headers: {'Content-Type': "application/json"}
        })
        const data=await peticion.json()
        return data
    },
    async deleteStudent_model(studentID){
        const url=`https://communities.free.beeceptor.com/students/${studentID}`
        const peticion=await fetch (url, {
            method: "DELETE"
        })
        const data=await peticion.json()
        return data
    },

    async getStudent_ID(studentID){
        const peticion=await fetch (`https://communities.free.beeceptor.com/students/${studentID}`)
        const data=await peticion.json()
        return data
    }
}

export default studentModel

