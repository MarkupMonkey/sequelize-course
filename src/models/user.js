import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import environment from '../config/environment';

export default (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.RefreshToken = User.hasOne(models.RefreshToken);
            User.Roles = User.hasMany(models.Role)
        }

        static async hashPassword(password) {
            return bcrypt.hash(password, environment.saltRounds);
        };
        // const result = await createNewUser(...)
        // result === undefined
        static async createNewUser({  // metodi statici che implementeremo
            email,
            password,
            roles,
            username,
            firstName,
            lastName,
            refreshToken
        }) {
            return sequelize.transaction(() => {
                let rolesToSave = [];

                if (roles && Array.isArray(roles)) {// roles =['customer','admin']
                    rolesToSave = roles.map((role) => ({ role }));// rolesToSave = [{role: 'customer'}, {role: 'admin'}] 
                }

                return User.create(
                    {
                        email,
                        password,
                        username,
                        firstName,
                        lastName,
                        RefreshToken: { token: refreshToken },
                        Roles: rolesToSave, // rolesToSave = [{role: 'customer'}, {role: 'admin'}] 
                    },
                    { include: [User.RefreshToken, User.Roles] }
                );
            });
        }
    }

    User.init(
        {
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: 'Not a valid email address, sorry.'
                    },
                    notNull: {
                        msg: 'Email is required, motherfucker.'
                    }
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(50),
                unique: true,
                validate: {
                    len: {
                        args: [2, 50],
                        msg: 'Username must contain between 2 and 50 characters',
                    },
                },
            },
            firstName: {
                type: DataTypes.STRING(50),
                validate: {
                    len: {
                        args: [3, 50],
                        msg: 'First name must contain between 3 an 50 characters',
                    },
                },
            },
            lastName: {
                type: DataTypes.STRING(50),
                validate: {
                    len: {
                        args: [3, 50],
                        msg: 'Last name must contain between 3 an 50 characters',
                    },
                },
            },
        },
        {
            sequelize, modelName: 'User', defaultScope: { attributes: { exclude: ['password'] } },
            scopes: {
                withPassword: {
                    attributes: { include: ['password'] },
                },
            },
        }
    );
    // user = await User.findOne({where: {email: 'test@example.com}})
    // user.email, user.username, user.firstName, user.lastName, user.password
    // await user.comparePassword('test123#')
    User.prototype.comparePasswords = async function (password) {
        return bcrypt.compare(password, this.password);
    }

    User.beforeSave(async (user, option) => {
        const hashedPassword = await User.hashPassword(user.password);
        user.password = hashedPassword;
    });

    User.afterCreate((user, options) => {
        delete user.dataValues.password;
    })

    return User;
};