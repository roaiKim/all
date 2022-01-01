import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "ro_user" })
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", unique: true })
    name: string;

    @Column("varchar", { select: false })
    password: string;

    @CreateDateColumn({ type: "datetime", name: "create_time", select: false })
    createtime: Date;

    @UpdateDateColumn({ type: "datetime", name: "update_time", select: false })
    updatetime: Date;

    @DeleteDateColumn({ type: "datetime", name: "delete_time", select: false })
    softDeleteTime: Date;
}
