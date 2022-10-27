# CheckServ

> **What is "CheckServ" ?**
> This is a service that allows you to test connections on one or more servers are up or one or more services are working. If the tested connection is unreachable then the service will send an email to all users specified in the conf file.

---

## **Supported connection**

- Ping :hostname
- TCP :hsotname :port

## **How to Setup Checkserv**

### **Windows** & **Linux** & **Mac OS**

**1/** You need to install `node` and `npm` on your machine.

After you need to install the module called `forever`, like this :

```Shell
npm i -g forever
```

**2/** clone this repository and edit conf file at `Checkserv/config/default.json`

**3/** Install dependances, build the project and run it.

**Intall**
```Shell
npm i
```
**Build**
```Shell
npm run build
```
**Start**
```Shell
npm run start
```

You can use these command :
- `npm run start` - For start the service.
- `npm run restart` - For restart the service. Usefull for refresh config file after edit.
- `npm run stop` - For stop the service.
- `npm run test` - For start the service and watch output

If you need to know if the service is working you can use this command :
```Shell
forever list
```


### **Docker**

You can run **checkserv** with docker. 

**Create config File**

Before run docker image you need to create a configuration file 'default.json' into a config folder. See **Edit Configuration file** to edit it.

**In command line**

*On Linux & Mac OS :*
```Powershell
docker run -d -v /path/to/config:/app/config -v /path/to/logs/:/app/logs --name <container_name> gpatruno/checkserv
```
*On Windows :*
```Powershell
docker run -d -v C:\path\to\config:/app/config -v C:\path\to\logs:/app/logs --name <container_name> gpatruno/checkserv
```

**Or with docker-compose**

```Yaml
version: '3.1'

services:
  checkserv:
    image: gpatruno/checkserv
    container_name: <container_name>
    restart: unless-stopped
    volumes:
      - /path/to/config:/app/config
      - /path/to/logs:/app/logs

volumes:
  checkserv:
```

## **Edit Configuration file**

### **APP Configuration**

Edit the default.json file at checkserv/config/default.json like the following demo : 

```YAML
APP:
  CLEAR_LOG: true
  CUSTOM_CRON: '* * * * *'
  SHORT_CRON: false
  LONG_CRON: false
```

### **SMTP Configuration**

```YAML
SENDER:
  EMAIL: example@mail.com
  EMAIL_PASSWORD: Password1234
  HOST: smtp.example.com
  PORT_EMAIL: 450
```

> If you want to test your SMTP Configuration, change the value of CUSTOM_CRON to set "TEST_MAIL" like this :

```YAML
APP:
  CLEAR_LOG: true
  CUSTOM_CRON: 'TEST_MAIL'
  SHORT_CRON: false
  LONG_CRON: false
```

### **User Configuration**

```YAML
user:                               # a list of users to be notified
- email: user.viewer@mail.com
- name: User 2                      # name is optionnal
  email: user2.viewer@mail.com
```

### **Server Configuration**

```YAML
server:                             # A server list
- name: Server Demo
  host: demo.domaine-name.com
  port: 22                          # port is optionnal, default port: 22
  services:                         # A list of services to check from the server
  - name: Postgres  # Database 
    port: 5432
  - name: API       # API 
    port: 3000
- name: Server Perso
  host: perso.checkserv.com
  defaultstate: false              # The default state is optional (default state: true), the attribute is useful to initialise the application with the state of a defined service, which avoids sending a useless mail as soon as the application is launched
- name: Server Web
  host: database.domaine.com
  port: 80
```

## **Logs**

When the service start for the first time the folder "logs" will be create. Inside two file : 
- ```default.log``` - All logs (Mail send, pulse, state of server)
- ```error.log``` - Error handler

And if you use checkserv with forerver, two other file will be create by forever. At the root folder : 

- ```checkservout.log``` -  Output forever 
- ```checkserverror.log``` - Error forever


## **Module use**

- Mail - `nodemailer` // Send Mail
- Ping - `ping`             // Ping Server
- TCP - `tcp-port-used`     // Ping Server on custom port
- Config - `config` // Use config file
- Cron - `node-cron` // To schedule task
- Logger - `winston` // To output Logs

## **Test your configuration**

### **Windows**

With Powershell : 

```Powershell
Test-NetConnection -ComputerName <host> -port <port>
```

> Be care Powershell test only TCP connection, service listenning port udp will not work with Powershell and with this service
