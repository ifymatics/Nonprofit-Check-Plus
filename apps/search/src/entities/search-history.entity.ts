import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('search_history')
export class SearchHistory {
  //  bmf_status: result.bmf_status,
  //       organization_name: result.organization_name,
  //       ein: result.ein,
  //       state: result.state_name,
  //       city: result.pub78_city,
  //       pub78_verified: result.pub78_verified,
  @PrimaryGeneratedColumn()
  ein: string;

  @Column({ nullable: true })
  bmf_status: boolean;

  @Column({ nullable: true })
  pub78_verified: string;

  @Column({ nullable: true })
  organization_name: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state_name: string;

  @Column()
  query: string;

  @Column({ type: 'jsonb' })
  result: any;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
