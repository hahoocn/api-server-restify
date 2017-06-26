# api-server-restify
A Node.js RESTful API server with restify

基于Node.js(版本:8), Restify, Docker, Postgresql, Redis开发后端RESTful API接口的脚手架

## 安装
- 安装[Node.js](https://nodejs.org) (请安装8的最新版)
- 安装[Docker](https://www.docker.com/) (请设置阿里云等镜像加速器, 不用加速器拉镜像速度很慢)
- 安装[Docker Compose](https://github.com/docker/compose/releases)

````
$ git clone https://github.com/hahoocn/api-server-restify
````
根据项目情况，修改镜像名称和配置：

- 开发环境：修改`/deploy/development/docker-compose.yml`和`/docker-compose.yml`中的`image: my-api-dev` 名称，默认是`my-api-dev`
- 生产和测试环境: 
  * 修改`/deploy/production/docker-compose.yml`和`/deploy/staging/docker-compose.yml`配置，镜像名称请修改配置文件中`api`部分的`image: my-api:latest`，比如可使用私有镜像域名为前缀的名称。
  * 修改`/package.json`中`scripts`部分的`docker:build`和`docker:build-staging`中的`-t my-api:staging`镜像名称。
- 修改Postgresql数据库密码: 请修改以下配置文件相关Postgresql密码部分
  * `/config/app/config.json`
  * `/docker-compose.yml`
  * `/deploy/production/docker-compose.yml`
  * `/deploy/staging/docker-compose.yml`
- 修改Redis密码: 请修改以下配置文件相关Redis密码部分
  * `/config/app/config.json`
  * `/config/redis/redis.conf`中的`requirepass`部分

````
$ npm run docker:build-dev
````

## 构建开发环境
````
$ npm run docker:build-dev
````
生成开发用的docker镜像，并且通过镜像中的环境初始化安装node包，生成`node_modules`文件夹

## 启动开发环境
````
$ npm run docker:dev
````
或者在项目根文件夹下运行命令：
````
$ docker-compose up -d
````

通过docker-compose启动api web, postgres, redis三个容器，api web端口为8080, postgres端口为5432, redis端口为6379。数据库可通过本地客户端工具连接进行操作和调试。

测试接口是否正常启动：请访问`http://localhost:8080/hello`看是否有反馈信息。

## 停止开发环境
````
$ npm run docker:dev-stop
````
或者在项目根文件夹下运行命令：
````
$ docker-compose down
````

## 生成测试环境docker镜像
````
$ npm run docker:build-staging
````

## 生成生产环境docker镜像
````
$ npm run docker:build
````
