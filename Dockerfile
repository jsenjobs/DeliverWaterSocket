# 指定我们的基础镜像是node，版本是v8.0.0
# FROM node:8.0.0
FROM centos:centos7.1.1503
# FROM node:8.0.0
# 指定制作我们的镜像的联系人信息（镜像创建者）
MAINTAINER Jsen
ENV TZ "Asia/Shanghai"
ADD http://mirrors.aliyun.com/repo/Centos-7.repo /etc/yum.repos.d/CentOS-Base.repo
ADD http://mirrors.aliyun.com/repo/epel-7.repo /etc/yum.repos.d/epel.repo
RUN yum -y install python-setuptools && \
    easy_install supervisor && \
    yum install -y openssl && \
    yum install -y epel-release && \
    yum install -y nodejs && \
    yum install -y npm && \
    npm install -g pm2 && \
    yum clean all
COPY . /app/
WORKDIR /app

ADD	./dockerconf/supervisord.conf /etc/supervisord.conf

EXPOSE 7083

# 容器启动时执行的命令，类似npm run start
CMD /usr/bin/supervisord -c /etc/supervisord.conf
