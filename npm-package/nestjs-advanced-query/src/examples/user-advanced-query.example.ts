import { Controller, Injectable } from '@nestjs/common';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

import { AbstractAdvancedReadController } from '../lib/abstract-advanced-read.controller';
import { AdvancedQueryRequest } from '../lib/advanced-query.types';
import { AdvancedConditionType, AdvancedLogicalMode } from '../lib/advanced-query.enums';
import { AbstractAdvancedReadService } from '../lib/advanced-read.service';

/**
 * 公司实体。
 */
@Entity('companies')
export class CompanyExample {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}

/**
 * 部门实体。
 */
@Entity('departments')
export class DepartmentExample {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => CompanyExample)
  company!: CompanyExample;
}

/**
 * 用户实体。
 */
@Entity('users')
export class UserExample {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  status!: string;

  @Column({ type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'json', nullable: true })
  tags?: Array<Record<string, unknown>>;

  @ManyToOne(() => DepartmentExample)
  department!: DepartmentExample;
}

/**
 * 用户高级查询服务示例。
 *
 * 实际项目里可在模块中注入 TypeORM Repository<UserExample> 后传入本类。
 */
@Injectable()
export class UserExampleReadService extends AbstractAdvancedReadService<UserExample> {
  constructor(repository: Repository<UserExample>) {
    super(repository, {
      alias: 'user',
      defaultPageSize: 20,
      maxPageSize: 200,
    });
  }
}

/**
 * 用户高级查询控制器示例。
 */
@Controller('users')
export class UserExampleReadController extends AbstractAdvancedReadController<UserExample> {
  constructor(private readonly userReadService: UserExampleReadService) {
    super();
  }

  protected getService() {
    return this.userReadService;
  }
}

/**
 * 分页查询示例。
 *
 * 说明：
 * - selectColumns 支持联表字段，例如 department.name、department.company.name
 * - conditions.property 支持 a.b.c 这种路径格式
 * - orders.orderBy 同样支持联表字段排序
 */
export const advancedPageRequestExample: AdvancedQueryRequest = {
  pageNo: 0,
  pageSize: 10,
  selectColumns: [
    'id',
    'name',
    'department.name',
    'department.company.name',
  ],
  conditionBodies: [
    {
      mode: AdvancedLogicalMode.AND,
      conditions: [
        {
          property: 'status',
          values: ['ENABLED'],
          type: AdvancedConditionType.EQUAL,
        },
        {
          wrapper: 'compound',
          mode: AdvancedLogicalMode.OR,
          conditions: [
            {
              property: 'name',
              values: ['张三'],
              type: AdvancedConditionType.LIKE,
            },
            {
              property: 'department.company.name',
              values: ['OpenAI'],
              type: AdvancedConditionType.LIKE,
            },
          ],
        },
        {
          property: 'tags',
          values: [{ code: 'VIP', enabled: true }],
          type: AdvancedConditionType.JSON_ARRAY_OBJECT_EQUAL,
        },
      ],
    },
  ],
  conditionBodyMode: AdvancedLogicalMode.AND,
  orders: [
    {
      orderBy: 'department.name',
      ascending: true,
    },
    {
      orderBy: 'createdAt',
      ascending: false,
    },
  ],
};

/**
 * 列表查询示例。
 */
export const advancedListRequestExample: AdvancedQueryRequest = {
  conditionBodies: [
    {
      mode: AdvancedLogicalMode.AND,
      conditions: [
        {
          property: 'department.company.name',
          values: ['OpenAI'],
          type: AdvancedConditionType.EQUAL,
        },
      ],
    },
  ],
  orders: [
    {
      orderBy: 'name',
      ascending: true,
    },
  ],
};

/**
 * 唯一查询示例。
 */
export const advancedUniqueGetRequestExample: AdvancedQueryRequest = {
  conditionBodies: [
    {
      mode: AdvancedLogicalMode.AND,
      conditions: [
        {
          property: 'department.company.name',
          values: ['OpenAI'],
          type: AdvancedConditionType.EQUAL,
        },
        {
          property: 'name',
          values: ['张三'],
          type: AdvancedConditionType.EQUAL,
        },
      ],
    },
  ],
};
