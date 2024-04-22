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
<h3>Broken Access Control</h3>

How [OWASP](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) describes Broken Access Control:
> Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits.

<h4>Example Exploit</h4>
Description

<h3>Cryptographic Failure (Specifically accessed through SQLi)</h3>

How [OWASP]([url](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)) describes Crypto Graphic Failures:
> Failures related to cryptography (or lack thereof). Which often lead to exposure of sensitive data.

<h4>Example Exploit</h4>
Description

<h3>Injection (Specifically XSS)</h3>

How [OWASP](https://owasp.org/www-community/Injection_Theory) describes Injection:
> An attacker's attempt to send data to an application in a way that will change the meaning of commands being sent to an interpreter.

<h4>Example Exploit</h4>

On the homepage of the site there is search functionality:


![image](https://github.com/GabrielBrits/COMS4507-Project/blob/main/screenshots/Search.png)

When the following script is entered:

```<script>alert('XSS Attack!');</script>```

We can confirm that there is a Cross Site Scripting vulnerability in the application through the above script. This script only displays an alert detailing 'XSS Attack!', however this confirms to use that we can get the backend of the webapp to execute our own malicious code which could steal cookies to hijack user sessions, inject malware or scan internal ports. 


![image](https://github.com/GabrielBrits/COMS4507-Project/blob/main/screenshots/XSS.png)
