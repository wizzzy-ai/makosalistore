import bcrypt from 'bcryptjs'

const Users = [
    {
        name: 'Admin User',
        email: 'admin@urbanthreads.shop',
        password: bcrypt.hashSync('admin123', 12),
        isAdmin: true
    },
    {
        name: 'Sample Customer',
        email: 'customer@urbanthreads.shop',
        password: bcrypt.hashSync('customer123', 12),
        isAdmin: false
    }
]

export default Users

