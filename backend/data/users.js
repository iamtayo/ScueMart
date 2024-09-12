import bcrypt from 'bcryptjs';

const users = [
    {
        name : "Admin",
        email : "admin@gmail.com",
        password : bcrypt.hashSync("12345", 10),
        isAdmin : true
    },
    {
        name : "John Doe",
        email : "John@gmail.com",
        password : bcrypt.hashSync("12345", 10),
    },
    {
        name : "Jane Doe",
        email : "Jane@gmail.com",
        password : bcrypt.hashSync("12345", 10),

    }
];

export default users;