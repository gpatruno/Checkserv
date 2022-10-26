# Alert By Mail

> **What is "Alert By Mail" ?**
> This is a service that allows you to test connections on one or more servers. If the tested connection is unreachable then the service will send an email to all users specified in the conf file.

---

## **Supported connection**

- Ping :hostname
- TCP :hsotname :port

## **How to Setup AlertByMail**

### **Windows** & **Linux**

**1/** You need to install `node` and `npm` on your machine.
After you need to install the module called `forever`, like this 

```JavaScript
npm i -g forever
```

**2/** clone this repository edit conf file at AlertByMail/config/default.json.

**3/** Build the project and run it.

```JavaScript
npm run build
```

```JavaScript
npm run start
```

### **Docker**

You can run AlertByMail with docker. 

**Create config File**

Before run docker image you need to create a configuration file 'default.json' into a config folder. See **Edit Configuration file** to edit it.

**In command line**

```Powershell
docker run -d -v /path/to/config:/app/config -v /path/to/logs/:/app/logs --name <container_name> alertbymail
```

**Or with docker-compose**

```Yaml
version: '3.1'

services:
  alertbymail:
    image: alertbymail
    container_name: <container_name>
    restart: unless-stopped
    volumes:
      - /path/to/config:/app/config
      - /path/to/logs:/app/logs

volumes:
  alertbymail:
```

## **Edit Configuration file**

### **APP Configuration**

Edit the default.json file at AlertbyMail/config/default.json like the following demo : 

```JSON
"APP": {
    "CLEAR_LOG": false,  // Default to 'false', set to 'true' to clear logs after the service restart
    "CUSTOM_CRON": null, // If you want a custom cron, see https://crontab.guru/ for the format
    "SHORT_CRON": true, // Default to 'true', set to 'false' to disable cron: Every minute 5 minutes
    "LONG_CRON": false // Default to 'false', set to 'true' to enable cron: At minute 5 past every 4th hour.
  }
```

### **SMTP Configuration**

```JSON
"sender": {
    "EMAIL": "",               // Mail to use to send Alert
    "EMAIL_PASSWORD": "",      // Mail password
    "HOST": "",                // SMTP Server
    "PORT_EMAIL": 465          // Port SMTP Server
  }
```

> If you want to test your SMTP Configuration, change the value of CUSTOM_CRON to set "TEST_MAIL" like this :

```JSON
"APP": {
    "CLEAR_LOG": false,  
    "CUSTOM_CRON": "TEST_MAIL", // Send a mail a the start of the service
    "SHORT_CRON": false, 
    "LONG_CRON": false
  }
```

### **User Configuration**

```JSON
"user": [                       // An array user to alert when a service change state
    {
      "name": "",               // Username, optionnal
      "email": ""               // mail, mandatory
    },{
      "email": ""
    }
  ]
```

### **Server Configuration**

```JSON
"server": [                 // An array server to ping every pulse
    {
      "name": "",           // Name of server, mandatory
      "host": "",           // Host or Ip Adress, mandatory
      "method": "telnet",   // Method to use : telnet / ping (default to 'telnet')
      "port": 443           // port to use, mandatory
    }
]
```

## **Logs**

When the service start for the first time the folder "logs" will be create. Inside two file : 
- ```default.log``` - All logs (Mail send, pulse, state of server)
- ```error.log``` - Error handler

And if you use AlertByMail with forerver, two other file will be create by forever. At the root folder : 

- ```abymailout.log``` -  Output forever 
- ```abymailerror.log``` - Error forever


## **Module use**

- Nodemailer - nodemailer // Send Mail
- Ping - ping             // Ping Server
- TCP - tcp-port-used     // Ping Server on custom port
- Config - config // Use config file
- Cron - node-cron // To schedule task
- Logger - winston // To output Logs
