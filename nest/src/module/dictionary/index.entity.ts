import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "ro_general" })
export class DictionaryEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", unique: true })
    code: string;

    @Column({ type: "varchar", nullable: true })
    text: string;

    @Column("longtext")
    content: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @Column({ type: "int", default: 2 })
    isJson: number;

    @Column({ type: "int", default: 2 })
    type: number;

    @CreateDateColumn({ type: "datetime", name: "create_time", select: false })
    createtime: Date;

    @UpdateDateColumn({ type: "datetime", name: "update_time", select: false })
    updatetime: Date;

    @DeleteDateColumn({ type: "datetime", name: "delete_time", select: false })
    softDeleteTime: Date;
}
