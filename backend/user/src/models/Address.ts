import { DataTypes, Model, Optional }  from "sequelize";
import sequelize  from "../config/configdb";

export interface AddressAttrs{ 
    id: number;
    userId: number;
    phone: string;
    address: string;
    street: string;
    ward: string ;  
    province: string;
    isDefault: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
type  AddressCreation = Optional<AddressAttrs, "id"| "userId"| "createdAt" | "updatedAt"> ;

class Address extends Model<AddressAttrs, AddressCreation> implements  AddressAttrs{
    public id!: number;
    public userId!: number;
    public phone!: string;
    public address!: string;
    public street!: string; 
    public ward!: string ;
    public province!: string;
    public isDefault!: boolean;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;  
}
Address.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            },
            userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            },
             phone: {
            type: DataTypes.STRING(20), 
            allowNull: false,
            },
            address: {
            type: DataTypes.STRING(255),
            allowNull: false,
            },
            street: {
            type: DataTypes.STRING(255),
            allowNull: false,
            },
            ward: {
            type: DataTypes.STRING(100),
            allowNull: true,
            },
            province: {
            type: DataTypes.STRING(100),
            allowNull: false,
            },
             isDefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            },
    },
    {
        sequelize,
        modelName: "Address",
        tableName: "Addresses",
        timestamps: true
    }
)
export default Address;