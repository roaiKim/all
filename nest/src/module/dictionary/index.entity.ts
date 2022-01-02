import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "ro_general" })
export class DictionaryEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    code: string;

    @Column("varchar")
    text: string;

    @Column("longtext")
    content: string;

    @Column("varchar")
    description: string;

    @Column("int")
    isJson: number;

    @CreateDateColumn({ type: "datetime", name: "create_time", select: false })
    createtime: Date;

    @UpdateDateColumn({ type: "datetime", name: "update_time", select: false })
    updatetime: Date;

    @DeleteDateColumn({ type: "datetime", name: "delete_time", select: false })
    softDeleteTime: Date;
}
