import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity as User } from "../../users/entities/user.entity";
import { Post } from "../../post/entities/post.entity";

@Entity({name : 'comment'})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  writer: string;

  @Column()
  postId: number;

  @Column({type: 'varchar', length: 1000})
  content: string;
  
  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.comment, { cascade:true, nullable: false, onDelete: 'CASCADE' }
  )
  @JoinColumn({name: 'writer'})
  user:User;

  @ManyToOne(
    () => Post,
    (post) => post.comment, { cascade:true, nullable: false, onDelete: 'CASCADE' }
  )
  post:Post;
}
