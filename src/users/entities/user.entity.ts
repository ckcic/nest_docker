import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { Post } from "../../post/entities/post.entity";
import { Comment } from "../../comment/entities/comment.entity";

@Entity({name: 'user'})
@Unique(['email'])
export class UserEntity extends BaseEntity{
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;
  
  @Column({ length: 200 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;

  @Column({default: "user"})
  permission: string;

  @OneToMany(() => Post, (post) => post.user )
  post: Post[];

  @OneToMany(() => Comment, (comment) => comment.user )
  comment: Comment[];
}
