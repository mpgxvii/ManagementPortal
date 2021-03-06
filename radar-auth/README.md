RADAR-Auth 
==========
RADAR authentication and authorization library. This project provides classes for authentication and
authorization of clients connecting to components of the RADAR platform.

Configuration
-------------

Add the dependency to your project.

Gradle:
```groovy
compile group: 'org.radarcns', name: 'radar-auth', version: '0.5.8'
```

The library expects the identity server configuration in a file called `radar-is.yml`. Either set 
the environment variable `RADAR_IS_CONFIG_LOCATION` to the full path of the file, or put the file 
somewhere on the classpath. The file should define `resourceName` and at least one of
`publicKeyEndpoints` or `publicKeys`. You can specify both, than public keys fetched from the
endpoints as well as public keys defined in the file will be used for validation.

| Variable name             | Description                                                                                                                                                                                                                                                                                                                           |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `resourceName`            | The name of this resource. It has to appear in the `audience` claim of a JWT token in order for the token to be accepted.                                                                                                                                                                                                             |
| `publicKeyEndpoints`      | List of server endpoints that provide the public key of the keypair used to sign the JWTs. The expected response from this endpoint is a JSON structure containing two fields: `alg` and `value`, where `alg` should be equal to `SHA256withRSA` or ``SHA256withECDSA`, and `value` should be equal to the public key in PEM format.  |
| `publicKeys`              | List of PEM formatted public keys for JWT validation. You can use YAML [literal style] to conveniently specify a multiline value for a variable. Also handy for testing scenario's where you don't necessarily have access to the public key endpoint. Entries can be RSA or EC public keys.                                          |

For example:

```yaml
resourceName: resource_name
publicKeyEndpoints:
 - http://localhost:8080/oauth/token_key
```

or

```yaml
resourceName: res_ManagementPortal
publicKeyEndpoints:
 - http://localhost:8080/oauth/token_key
publicKeys:
  - |-
    -----BEGIN PUBLIC KEY-----
    MIICHDANBgkqhkiG9w0BAQEFAAOCAgkAMIICBAKCAfsAqM4o+hVAdF2QATQBmpehSMyhdqKvwh9mrfnxDNtctZYlpiQXMbq4uqRgp98aBy6bMKKr3k0rSXTzr27Y+tdLUWXqbl4y8kKm8rGZo9gTbPyhqPm4f4OIxMRJcuhQ7f8qBY87w9buzClQeUs3h5f+DUVRUfB9FnDtim+ma3mFqYh38TMnrBapCtG+7iVKRFgGv6JWiNTql+oVBPNuUX3koc5/zO6IhrD49vBbsjaRWTJV2xMNll82gPvVLtgQNA2t7iGnUPhfKDj1NInZeg79NzFnWAa9Jtc1r2Q7D68MiJhYZN2QAlZS1GfbELnRAeUmSxT5i3BHu23iz9zluhIhYe1vhA1QWk2HsriGL9w+iFqzYlk5P3GCAE+nfNmM/6GIp1ehzW+/4+xgik5rOakCWw4vewmSBWOrV/XZvT2ZT3AA6zIByWdERyMOVJmd9rqPH1FIDtQk8h2jFTqIvBda727DHXeUB9J4hHQTzQmvOxPMipwDslxWOjnG4nbq6Exme0o/ELMOxt+4APH6KW+LqCNl5jGdbKxySLQyNgfUjhXJ06U1b8JHPheTnWcKO+cMmhyheUkZmLMLK2mlAsR+JJeBDY1/jd7+q6hgymeJzoDoXJj4LARiYZ+StRr/E0+P8DrprWYZPi496VIzwgV8otV9fVz29V501rcCAwEAAQ==
    -----END PUBLIC KEY-----
  - |-
    -----BEGIN EC PUBLIC KEY-----
    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEvmBia5inhASHAVrFBB5JAh0ne/aKb6z/sCIuWzKp/azFcD/OPJ2H6RPLn3t7XA4oAa2FR3GB4ZhU7SCh20FUhA==
    -----END EC PUBLIC KEY-----
```


We have deprecated the use of public key configurations in radar-is.yml for token validation from radar-auth:0.5.6.
We recommend you to fetch public keys from Management Portal, instead of locally configuring public-keys. 
We have upgraded to java-jwt:0.3.7 from radar-auth:0.5.4, which have refactored support for ECDSA algorithms.
If you have used management-portal:0.5.3 or earlier versions, you can use deprecated public-key configurations to keep validating old signatures. 

Usage
-----

Once you have configured your project and have your configuration file in place, you can use the 
`TokenValidator` class to validate and decode incoming tokens. It is recommended to have only one
instance of this class in your application. Use the `validateAccessToken()` method to validate and
decode a client access token. This library builds on Auth0's [Java-JWT] library for token 
validation.

To check for permissions, you can use the `RadarAuthorization` class. You can check permissions in
three ways, depending on your use case. You pass the `DecodedJWT` object obtained from the 
`TokenValidator` to the the `checkPermission...` methods. These methods will throw a 
`NotAuthorizedException` if a user, identified by the token, does not have the requested 
permission. This allows you to handle a not authorized case any way you please. You could even add
an `ExceptionTranslator` for this exception in your Spring application. The three checking methods
are:
- `checkPermission()`: to check a permission regardless of any affiliation to a project
- `checkPermissionOnProject()`: to check a permission in the context of a project
- `checkPermissionOnSubject()`: to check a permission in the context of a subject

All of these methods will first check for a correct OAuth scope to be present. Scopes should have
the following structure: `ENTITY.OPERATION`. Where `ENTITY` is any of `SOURCETYPE, SOURCEDATA, 
SOURCE, SUBJECT, USER, ROLE, PROJECT, OAUTHCLIENTS, AUDIT, AUTHORITY, MEASUREMENT` and `OPERATION`
is any of `CREATE, UPDATE, READ, WRITE`. If a correct scope is present, access is granted 
immediately. Therefore it is recommended only to use scopes when there is no user, as is the case
with the `client_credentials` grant. If there are no scopes defined, the check continue on the level
of user roles.

Example
-------
Check the `AuthenticationFilter` class in the RADAR-Gateway project. It uses servlet filters to
first validate and decode the token, and then add it to the servlet context. Subsequent filters can
use the decoded token for further decision making.

[Java-JWT]: https://github.com/auth0/java-jwt
[literal style]: http://www.yaml.org/spec/1.2/spec.html#id2795688
