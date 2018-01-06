FROM  jsenht/node:9.3.0
# 指定制作我们的镜像的联系人信息（镜像创建者）
MAINTAINER jsen <jsen1922279340@163.com>

ENV TZ "Asia/Shanghai"
ENV TERM chaosstudio

WORKDIR /app
RUN cnpm i
ADD	./dockerconf/supervisord.conf /etc/supervisor.conf.d/deliverwaterso.conf
EXPOSE 7083
