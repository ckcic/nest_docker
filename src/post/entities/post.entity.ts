import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, OneToMany, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import { Board } from "../../board/entities/board.entity";
import { UserEntity as User } from "../../users/entities/user.entity";
import { Comment } from "../../comment/entities/comment.entity";

@Entity({name: 'post'})
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  writer: string;
  
  @Column()
  boardId: number;

  @Column({type: 'varchar', length: 100})
  title: string;

  @Column({type: 'varchar', length: 1000})
  content: string;

  @Column({default: 0})
  hit: number;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.post, { cascade:true, nullable: false, onDelete: 'CASCADE' }
  )
  @JoinColumn({name: 'writer'})
  user:User;

  @ManyToOne(
    () => Board,
    (board) => board.post, { cascade:true, nullable: false, onDelete: 'CASCADE' }
  )
  board:Board;

  @OneToMany(() => Comment, (comment) => comment.post )
  comment: Comment[];
}