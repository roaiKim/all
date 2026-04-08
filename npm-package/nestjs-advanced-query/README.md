# nestjs-advanced-query

一个面向 `NestJS + TypeORM` 的高级查询 npm 库，支持：

- 单表任意字段查询
- 级联关联表字段查询
- 条件体 `AND/OR` 组合
- `compound` 混合嵌套条件
- 排序
- 分页
- 唯一查询
- 自定义返回字段

## 安装

```bash
npm install nestjs-advanced-query
```

同时请确保业务项目已安装：

```bash
npm install @nestjs/common @nestjs/core typeorm class-validator class-transformer reflect-metadata
```

## 查询协议

```json
{
  "pageNo": 0,
  "pageSize": 10,
  "selectColumns": ["id", "name", "department.name"],
  "conditionBodies": [
    {
      "mode": "AND",
      "conditions": [
        {
          "property": "status",
          "values": ["ENABLED"],
          "type": "EQUAL"
        },
        {
          "wrapper": "compound",
          "mode": "OR",
          "conditions": [
            {
              "property": "name",
              "values": ["张三"],
              "type": "LIKE"
            },
            {
              "property": "department.name",
              "values": ["研发"],
              "type": "LIKE"
            }
          ]
        }
      ]
    }
  ],
  "conditionBodyMode": "AND",
  "orders": [
    {
      "orderBy": "createdAt",
      "ascending": false
    },
    {
      "orderBy": "department.name",
      "ascending": true
    }
  ]
}
```

## 支持的条件类型

- `EQUAL`
- `NOT_EQUAL`
- `LESS_THAN`
- `LESS_THAN_OR_EQUAL`
- `GREATER_THAN`
- `GREATER_THAN_OR_EQUAL`
- `IN`
- `NOT_IN`
- `LIKE`
- `NOT_LIKE`
- `IS_NULL`
- `JSON_ARRAY_OBJECT_EQUAL`
- `IS_NOT_NULL`
- `JSON_ARRAY_OBJECT_NOT_EQUAL`

## JSON 数组对象条件

新增：

- `JSON_ARRAY_OBJECT_EQUAL`
- `JSON_ARRAY_OBJECT_NOT_EQUAL`

适用于查询 JSON 数组字段中是否包含某个对象，示例：

```json
{
  "conditionBodies": [
    {
      "mode": "AND",
      "conditions": [
        {
          "property": "tags",
          "values": [
            {
              "code": "VIP",
              "enabled": true
            }
          ],
          "type": "JSON_ARRAY_OBJECT_EQUAL"
        }
      ]
    }
  ]
}
```

如果需要一次匹配多个对象，也可以直接传数组：

```json
{
  "property": "tags",
  "values": [
    [
      { "code": "VIP" },
      { "code": "INTERNAL" }
    ]
  ],
  "type": "JSON_ARRAY_OBJECT_EQUAL"
}
```

当前实现说明：

- `PostgreSQL` 使用 `jsonb @>` 判断包含
- `MySQL / MariaDB` 使用 `JSON_CONTAINS`
- 其他数据库暂未支持这两个 JSON 条件类型

## 快速接入

### 1. 定义 Service

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractAdvancedReadService } from 'nestjs-advanced-query';

import { User } from './user.entity';

@Injectable()
export class UserReadService extends AbstractAdvancedReadService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository, {
      alias: 'user',
      defaultPageSize: 20,
      maxPageSize: 500,
    });
  }
}
```

### 2. 定义 Controller

```ts
import { Controller } from '@nestjs/common';
import { AbstractAdvancedReadController } from 'nestjs-advanced-query';

import { User } from './user.entity';
import { UserReadService } from './user-read.service';

@Controller('users')
export class UserReadController extends AbstractAdvancedReadController<User> {
  constructor(private readonly userReadService: UserReadService) {
    super();
  }

  protected getService() {
    return this.userReadService;
  }
}
```

### 3. 示例实体

```ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  status!: string;

  @Column()
  createdAt!: Date;

  @ManyToOne(() => Department)
  department!: Department;
}
```

## 自动联表规则

当属性路径为 `department.name`、`tenant.org.name` 时，库会自动：

1. 判断 `department` / `tenant` / `org` 是否为 TypeORM relation
2. 自动生成 `leftJoin`
3. 将最终字段解析为实际查询列

因此调用方只需要传递属性路径，不需要自己维护 join 逻辑。

## 返回规则

- 未传 `selectColumns` 时：
  - `advanced-page` 返回实体数组
  - `advanced-list` 返回实体数组
  - `advanced-unique-get` 返回实体对象
- 传入 `selectColumns` 时：
  - 返回扁平对象数组，例如 `{ "department.name": "研发部", "name": "张三" }`

## 标准接口

- `POST /{prefix}/advanced-page`
- `POST /{prefix}/advanced-list`
- `POST /{prefix}/advanced-unique-get`
- `GET /{prefix}/advanced-get/:id`

## 接口说明

当前抽象控制器已将查询型接口实现为 `POST + application/json body`，避免 `GET body` 在浏览器、网关、代理或 OpenAPI 工具链中的兼容性问题。

## 导出内容

```ts
export * from 'nestjs-advanced-query';
```
