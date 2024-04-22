# COMS4507-Project
<h2>Requirements</h2>

1. [Node.js](https://nodejs.org/en/download/current)

2. [Git](https://github.com/git-guides/install-git)

<h3>Getting Started</h3>

Install the requirements above, then you will want to download the project:

``` git clone https://github.com/GabrielBrits/COMS4507-Project/ ```

Change to the COMS4507-Project site directory:

``` cd COMS4507-Project/site ```

Install the projects dependencies using:

``` npm install ```

And to run the webserver:

``` node server.js ```

If successful, you should see the following message: Server listening at localhost:3000. This means that a local web server is now running and is listening for requests at localhost:3000. Open your browser and click the link.

<h2>Vulnerabilities</h2>
<h2>Broken Access Control</h2>

How [OWASP](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) describes Broken Access Control:
> Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits.

<h4>Example Exploit</h4>
Once logged in, users are redirected to a page displaying their account information, however it is possible to manipulate the URL to gain unauthorized access to another users account dashboard.

Entering a valid username and password:

![image](https://github.com/GabrielBrits/COMS4507-Project/blob/main/screenshots/Login.png)

Redirects us to the relevant account information:

![image](https://github.com/GabrielBrits/COMS4507-Project/blob/main/screenshots/BrokenAccessControl.png)

However, it is evident that this is working through an ID variable in the URL, changing this can then give us access to any users account information given we can guess their userID:

![image](https://github.com/GabrielBrits/COMS4507-Project/blob/main/screenshots/User3.png)

<h2>Cryptographic Failure (Specifically accessed through SQLi)</h2>

How [OWASP]([url](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)) describes Crypto Graphic Failures:
> Failures related to cryptography (or lack thereof). Which often lead to exposure of sensitive data.

<h4>Example Exploit</h4>
On the login page we are able to utilise SQL injection to access any user account given that we have their username. This can be done through entering the following script into the password field of the form:

```" OR "1"="1```

Once entered, the site redirects to the user profile page which will display their username and password in plain text. Thus, through SQL injection we have identified a cryptographic failure, as the resuting user password is displayed in plain text instead of being hashed. This means that the passwords are never hashed within the database, which is goes against the [NIST](https://www.nist.gov) guidelines of the secure storage of user data.

<h2>Injection (Specifically XSS)</h2>

How [OWASP](https://owasp.org/www-community/Injection_Theory) describes Injection:
> An attacker's attempt to send data to an application in a way that will change the meaning of commands being sent to an interpreter.

<h4>Example Exploit</h4>

On the homepage of the site there is search functionality:


![image](https://github.com/GabrielBrits/COMS4507-Project/blob/main/screenshots/Search.png)

When the following script is entered:

```<script>alert('XSS Attack!');</script>```

We can confirm that there is a Cross Site Scripting vulnerability in the application through the above script. This script only displays an alert detailing 'XSS Attack!', however this confirms to use that we can get the backend of the webapp to execute our own malicious code which could steal cookies to hijack user sessions, inject malware or scan internal ports. 


![image](https://github.com/GabrielBrits/COMS4507-Project/blob/main/screenshots/XSS.png)
