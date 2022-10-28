# CheckServ

> **Qu'est ce que CheckServ ?**
> **CheckServ** est un service permettant de surveiller le bon fonctionnement d'un ou plusieurs serveurs. Si l'un des serveurs n'est plus joignable, le logiciel enverra automatiquement un mail aux utilisateurs avec la date/heure et le serveur concerné. <br> CheckServ permet aussi de surveiller des services rattachés à un serveur. Si l'un des services n'est plus joignable par l'extérieur, alors le logiciel enverra un mail.

**Exemple :**
> Par exemple vous voulez surveiller un serveur **mon-serveur.com** qui héberge une API utilisant le port **3000** et un VPN utilisant le port **1194**. Si l'un des deux services n'est plus joignable le mail sera automatiquement envoyé à un ou plusieurs utilisateurs (selon la configuration). Mais si le serveur n'est plus joignable, alors, CheckServ enverra un mail pour le signaler aux utilisateurs mais le logiciel ne tentera pas de se connecter aux services associé a ce serveur pour éviter d'envoyer des mails inutile.

**Mail :**

<img src="demoMail.png" alt="demoMail" width="450"/>

---

## **Le type de connexion**

- TCP :hostname :port

> **ATTENTION** CheckServ test seulement les connexions en **TCP**, les services utilisants des ports en **UDP** ne fonctionneront pas avec le logiciel.

## **Comment mettre en place Checkserv**

### **Windows** & **Linux** & **Mac OS**

**1/** Tout d'abord vous avez besoin d'installer `node` et `npm` sur votre machine qui hébergera CheckServ.

Après vous allez devoir installer un module `forever`, de la manière suivante :

```Shell
npm i -g forever
```

**2/** Cloner le répertoire git et editer le fichier de configuration qui se trouve sous l'arborescence suivante : `Checkserv/config/default.json`

**3/** Intaller les dépendances, compiler le projet et lancer le :

**Installation des dépendances**
```Shell
npm i
```
**Compliation du projet**
```Shell
npm run build
```
**Lancement**
```Shell
npm run start
```

Vous pouvez utiliser les commandes suivantes :
- `npm run start` - Pour démarrer le service
- `npm run restart` - Pour redémarrer le service. Très utile pour prendre en compte la modification du fichier de configuration.
- `npm run stop` - Pour arrêter le service.
- `npm run test` - Pour démarrer le service et regarder la sortie console.

Si vous avez besoin de savoir si le service fonctionne, vous pouvez utiliser cette commande : 

```Shell
forever list
```


### **DOCKER**

Vous pouvez utiliser **checkserv** avec Docker. *Lien : [CheckServ Docker Hub](https://hub.docker.com/r/gpatruno/checkserv)*

**1/ Fichier de configuration**

> Tout d'abord pour que l'image Docker fonctionne correctement vous allez devoir créer et éditer le fichier de configuration. Ce fichier est indispensable pour le logiciel.<br> **Voir la partie Edition du fichier de conf** pour l'éditer correctement.

Dans le répertoire de votre choix créer un dossier `config` avec le fichier `default.yml` à l'intérieur. 

**2/ Lancer l'image Docker**

*Avec Linux & Mac OS :*
```Powershell
docker run -d -v /path/to/config:/app/config -v /path/to/logs/:/app/logs --name <container_name> gpatruno/checkserv
```
*Avec Windows :*
```Powershell
docker run -d -v C:\path\to\config:/app/config -v C:\path\to\logs:/app/logs --name <container_name> gpatruno/checkserv
```

*Avec docker-compose :*
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

## **Edition du fichier de conf**

### **Configuration de l'application**

>Avant de commercer l'édition du fichier de configuration, vous pouvez trouver un exemple dans l'arborescence : `checkserv/config/example.yml`

Pour commencer editer le fichier `default.yml` qui se trouve dans l'arborescence : `checkserv/config/default.yml`

### La première partie concerne seulement le comportement du logiciel CheckServ 

<table border="1" id="bkmrk-variable-obligatoire" style="border-collapse: collapse; width: 106.914%; height: 172.07px;"><colgroup><col style="width: 16.0718%;"></col><col style="width: 15.9481%;"></col><col style="width: 51.8006%;"></col><col style="width: 16.0718%;"></col></colgroup><tbody><tr style="height: 29.8785px;"><td class="align-center" style="height: 29.8785px;"> Attributs </td><td class="align-center" style="height: 29.8785px;">Obligatoire</td><td class="align-center" style="height: 29.8785px;">Description</td><td class="align-center" style="height: 29.8785px;">Valeur</td></tr><tr style="height: 33.6667px;"><td style="height: 33.6667px;">CLEAR_LOG</td><td class="align-center" style="height: 33.6667px;">oui</td><td style="height: 33.6667px;">Si 'true' Nettoie les logs au démarrage/redémarrage du logiciel</td><td style="height: 33.6667px;">true / false</td></tr><tr style="height: 29.8785px;"><td style="height: 29.8785px;">CUSTOM_CRON</td><td class="align-center" style="height: 29.8785px;">Non</td><td style="height: 29.8785px;">Permet définir son propre rythme de pulsation pour tester les serveurs/services. Attends une valeur au format CRON. Si la valeur passé est 'TEST_MAIL' au démarrage de l'application un mail sera envoyé. </td><td style="height: 29.8785px;">null OU '* * * * *' OU 'TEST_MAIL'</td></tr><tr style="height: 29.8785px;"><td style="height: 29.8785px;">SHORT_CRON</td><td class="align-center" style="height: 29.8785px;">Oui</td><td style="height: 29.8785px;">Envoi des pulsation toutes les 5 mins</td><td style="height: 29.8785px;">true / false</td></tr><tr style="height: 48.7674px;"><td style="height: 48.7674px;">LONG_CRON</td><td class="align-center" style="height: 48.7674px;">Oui</td><td style="height: 48.7674px;">Envoi des pulsations toutes les 4 heures</td><td style="height: 48.7674px;">true / false</td></tr></tbody></table>

> Si vous voulez faire votre propre pulsation vous pouvez utiliser le site suivant pour essayer le format cron : https://crontab.guru/
```YAML
APP:
  CLEAR_LOG: true
  CUSTOM_CRON: # Valeur : null / 'TEST_MAIL' / '(Format cron)' 
  SHORT_CRON: false
  LONG_CRON: false
```

### **SMTP Configuration**

```YAML
SENDER:
  EMAIL: example@mail.com       # Adresse mail
  EMAIL_PASSWORD: Password1234  # Mot de passe 
  HOST: smtp.example.com        # Serveur smtp
  PORT_EMAIL: 450               # Port smtp
```
> Si vous voulez tester votre configuration SMTP, vous pouvez mettre la valeur 'TEST_MAIL' dans la propriété CUSTOM_CRON. de la manière suivante `CUSTOM_CRON: 'TEST_MAIL'` et n'oubliez pas de renseigner une adresse mail dans la configuration ci-dessous.


### **Configuration des utilisateurs**

Tous les utilisateurs présent dans la liste seront notifié dès qu'un serveur/service changera d'état. 

```YAML
users:                              # Une liste d'utilisateur à informer
- email: user.viewer@mail.com
- name: User 2                      # l'attribut name est optionnel
  email: user2.viewer@mail.com
```

### **Configuration des serveurs**

Tous les serveurs présent dans la liste auront une pulsation conformément au CRON activé dans la configuration APP. 

<table border="1" id="bkmrk-variable-obligatoire" style="border-collapse: collapse; width: 113.086%; height: 205.643px;"><colgroup><col style="width: 15.5779%;"></col><col style="width: 84.4358%;"></col></colgroup><tbody><tr style="height: 29.8785px;"><td class="align-center" style="height: 29.8785px;">Attributs</td><td class="align-center" style="height: 29.8785px;">Description</td></tr><tr style="height: 33.6632px;"><td style="height: 33.6632px;">name</td><td style="height: 33.6632px;">Nom à donner au serveur. L'attribut doit être obligatoirement renseigné.</td></tr><tr style="height: 33.6632px;"><td style="height: 33.6632px;">host</td><td style="height: 33.6632px;">Le nom de domaine ou l'adresse IP du serveur à surveiller. L'attribut doit être obligatoirement renseigné. </td></tr><tr style="height: 33.6632px;"><td style="height: 33.6632px;">port</td><td style="height: 33.6632px;">Le numéro du port à utiliser pour la connexion. Par défaut le port utilisé est 22. L'attribut n'est pas obligé d'être renseigné.</td></tr><tr style="height: 33.6632px;"><td style="height: 33.6632px;">defaultState</td><td style="height: 33.6632px;">L'état par défaut du serveur. Valeur attendue: true/false. Si la valeur est 'false' le logiciel ne tentera pas de se connecter au serveur ni au services du serveur. Par défaut 'true'. L'attribut n'est pas obligé d'être renseigné.</td></tr><td style="height: 33.6632px;">services</td><td style="height: 33.6632px;">Une liste de service a surveiller qui sont héberger sur le même serveur. L'attribut n'est pas obligé d'être renseigné. Voir **Configuration des services** pour savoir comment les configurer.</td></tr></tbody></table>

```YAML
servers:                            # Une liste de serveurs
- name: Server Demo                 # Le nom du serveur
  host: demo.domaine-name.com       # Nom de domaine ou adresse IP
  port: 22                          # Optionnel, par défaut port: 22
  defaultstate: false               # Optionnel, par défaut defaultstate: true
  services:                         # Optionnel, par défaut services: null
```

### **Configuration des services**

Les services sont forcément rattaché à un serveur. Car le logiciel utilisera la même valeur de l'attribut **host** du serveur, seulement l'adressage du **port** changera. 

<table border="1" id="bkmrk-variable-obligatoire" style="border-collapse: collapse; width: 113.086%; height: 205.643px;"><colgroup><col style="width: 15.5779%;"></col><col style="width: 84.4358%;"></col></colgroup><tbody><tr style="height: 29.8785px;"><td class="align-center" style="height: 29.8785px;">Attributs</td><td class="align-center" style="height: 29.8785px;">Description</td></tr><tr style="height: 33.6632px;"><td style="height: 33.6632px;">name</td><td style="height: 33.6632px;">Nom à donner au service. L'attribut doit être obligatoirement renseigné.</td></tr><tr style="height: 33.6632px;"><td style="height: 33.6632px;">port</td><td style="height: 33.6632px;">Le numéro du port à utiliser pour la connexion. L'attribut doit être obligatoirement renseigné.</td></tr><tr style="height: 33.6632px;"><td style="height: 33.6632px;">defaultState</td><td style="height: 33.6632px;">L'état par défaut du service. Valeur attendue: true/false. Si la valeur est 'false' le logiciel ne tentera pas de se connecter au service. Par défaut 'true'. L'attribut n'est pas obligé d'être renseigné.</td></tbody></table>

```YAML
servers:                            
- name: Server Demo                 
  host: domaine-demo.com       
  services:
  - name: OpenVPN
    port: 1194
    defaultstate: false
  - name: API 
    port: 3000
```

## **Les Logs**

Quand le service est démarré pour la première fois le dossier `logs` sera créé. Avec à l'intérieur 2 fichiers : 

- ```default.log``` - Tous les logs (Mail envoyé, pulsation, état des serveurs et services)
- ```error.log``` - Les erreurs

Si vous utilisez CheckServ avec `forever`, deux autres fichiers seront créé à la racine du projet : 

- ```checkservout.log``` -  Output forever 
- ```checkserverror.log``` - Error forever

## **Tester la connexion**

    Il est possible de tester vos serveurs/services sans passer par le logiciel mais grâce à des outils tels que telnet, Test-NetConnection. 

### **Sur Windows**

Avec Powershell grâce à l'outil `Test-NetConnection` : 

```Powershell
Test-NetConnection -ComputerName <host> -port <port>
```
En cas de succès :

```Powershell
Test-NetConnection -ComputerName domaine-demo.com -port 5432


ComputerName            : domaine-demo.com
RemoteAddress           : 150.123.123.123
RemotePort              : 5432
InterfaceAlias          : Wi-Fi
SourceAddress           : 192.123.123.123
TcpTestSucceeded        : True
```
En cas d'échec :
```Powershell
Test-NetConnection -ComputerName domaine-demo.com -port 3000


ComputerName            : domaine-demo.com
RemoteAddress           : 150.123.123.123
RemotePort              : 3000
InterfaceAlias          : Wi-Fi
SourceAddress           : 192.123.123.123
PingSucceeded           : True
PingReplyDetails (RTT)  : 32 ms
TcpTestSucceeded        : False
```

### **Sur Linux**

Avec Bash grâce à l'outil `telnet` : 

```Bash
telnet <host> <port>
```

En cas de succès :

```Bash
telnet domaine-demo.com 5432
Trying 150.123.123.123...
Connected to domaine-demo.com.
Escape character is '^]'.
```
> Utiliser `Ctrl + C` ou `Ctrl + ] + q` pour quitter

En cas d'échec :

```Bash
telnet domaine-demo.com 3000
Trying 150.123.123.123...
telnet: Unable to connect to remote host: Connection timed out
```

## **Module utilisé**

- Mail - `nodemailer` // Envoi Mail
- TCP - `tcp-port-used`     // Se connecter à un serveur/service
- Config - `config` // Pour utiliser un fichier de configuration
- Cron - `node-cron` // Pour programmer les pulsations
- Logger - `winston` // Pour sortir les logs dans des fichiers
