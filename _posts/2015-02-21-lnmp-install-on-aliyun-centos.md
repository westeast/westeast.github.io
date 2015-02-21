---
layout: post
title: lnmp-install-on-aliyun-centos
category: lnmp
tags: linux,php
keywords: linux,php,mysql,nginx
description: lnmp集成环境安装过程
---

1，下载 准备
wget --no-check-certificate https://api.sinas3.com/v1/SAE_lnmp/soft/lnmp1.1-full.tar.gz



2,解压，查看发行版本，执行安装命令
tar -zxvf lnmp1.1-full.tar.gz -C 
cd lnmp1.1-full
./centos.sh
下面要先输入mysql密码后会编译安装lnmp中的的所有的组件.
nginx 端口80 mysql端口3306
